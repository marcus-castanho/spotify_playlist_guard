import cron, { ScheduledTask } from 'node-cron';
import { Playlist } from '../api/@types';
import { ApiClientService } from '../api';
import { ProducerService } from '../rabbitmq/jobs/producer.service';
import { SpotifyService } from '../spotify';
import { SchedulerConfig } from './@types';
import { TrackIdentifier } from '../spotify/@types';
import { LoggerService } from '../logger';

export class GuardBotService {
    private cronJob: ScheduledTask;

    constructor(
        private readonly schedulerConfig: SchedulerConfig,
        private readonly apiService: ApiClientService,
        private readonly spotifyService: SpotifyService,
        private readonly producerService: ProducerService,
        private readonly loggerService: LoggerService,
    ) {
        this.setUpScheduler();
    }

    setUpScheduler() {
        const { cronExpression, ...schedulerConfig } = this.schedulerConfig;
        this.cronJob = cron.schedule(
            cronExpression,
            () => this.guardRoutine(),
            schedulerConfig,
        );
    }

    async guardRoutine() {
        try {
            const playlists = await this.apiService
                .getActivePlaylists()
                .catch((error) => {
                    throw error;
                });

            for (let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i];

                this.producerService.runGuardBot(playlist);
            }
        } catch (error: any) {
            this.loggerService.log('%j', {
                error: error.message,
                message: 'Failed to fetch the api',
            });
        }
    }

    async runGuard(playlist: Playlist) {
        const { id, allowed_userIds, owner, snapshot_id } = playlist;
        const { refreshToken } = owner;
        await this.spotifyService.setTokens(refreshToken);
        const upToDatePlaylist = await this.spotifyService.getPlaylistData(id);
        const upToDateSnapshotId = upToDatePlaylist.snapshot_id;
        const tracksList = upToDatePlaylist.tracks.items;

        if (snapshot_id !== upToDateSnapshotId) {
            await this.checkPlaylist(
                id,
                allowed_userIds,
                tracksList,
                upToDateSnapshotId,
            );
        }
    }

    async checkPlaylist(
        id: string,
        allowedUsers: string[],
        tracks: SpotifyApi.PlaylistTrackObject[],
        upToDateSnapshotId: string,
    ) {
        const { tracksToRemove, newTrackIdList } = this.getPlaylistsDiff(
            allowedUsers,
            tracks,
        );

        if (tracksToRemove.length > 0) {
            await this.spotifyService.removeTracksFromPlaylist(
                id,
                tracksToRemove,
            );
        }

        await this.apiService.updatePlaylist(id, {
            snapshot_id: upToDateSnapshotId,
            tracks: newTrackIdList,
        });
    }

    getPlaylistsDiff(
        allowedUsers: string[],
        tracks: SpotifyApi.PlaylistTrackObject[],
    ) {
        const tracksToRemove: TrackIdentifier[] = [];
        const newTrackIdList: string[] = [];

        tracks.forEach((track) => {
            const userId = track.added_by.id;
            const trackId = track.track.id;

            if (!allowedUsers.includes(userId)) {
                tracksToRemove.push({ uri: `spotify:track:${trackId}` });
                return;
            }

            newTrackIdList.push(trackId);
        });

        return {
            tracksToRemove,
            newTrackIdList,
        };
    }
}
