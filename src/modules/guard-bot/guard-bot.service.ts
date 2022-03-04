import cron, { ScheduledTask } from "node-cron";
import { ApiClientService } from "../api/api.service";
import { SpotifyService } from "../spotify/spotify.service";

export class GuardBotService {
  private readonly cronJob: ScheduledTask;

  constructor(
    private readonly apiService: ApiClientService,
    private readonly spotifyService: SpotifyService
  ) {
    this.apiService = apiService;
    this.spotifyService = spotifyService;
    this.cronJob = cron.schedule(
      "0 * * * * *",
      async () => {
        try {
          await this.guardRoutine();
        } catch (error) {
          console.log(error);
        }
        return;
      },
      {
        scheduled: true,
        timezone: "America/Sao_Paulo",
      }
    );
  }

  async guardRoutine() {
    const playlists = await this.apiService.getActivePlaylists();

    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
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
          upToDateSnapshotId
        );
      }
    }
  }

  async checkPlaylist(
    id: string,
    allowedUsers: string[],
    tracks: SpotifyApi.PlaylistTrackObject[],
    upToDateSnapshotId: string
  ) {
    const { tracksToRemove, newTrackList } = this.getPlaylistsDiff(
      allowedUsers,
      tracks
    );

    if (tracksToRemove.length > 0) {
      await this.spotifyService.removeTracksFromPlaylist(id, tracksToRemove);
    }

    await this.apiService.updatePlaylist(id, {
      snapshot_id: upToDateSnapshotId,
      tracks: newTrackList,
    });
  }

  getPlaylistsDiff(
    allowedUsers: string[],
    tracks: SpotifyApi.PlaylistTrackObject[]
  ): any {
    const tracksToRemove: any[] = [];
    const newTrackList: string[] = [];

    tracks.forEach((track) => {
      const userId = track.added_by.id;
      const trackId = track.track.id;

      if (!allowedUsers.includes(userId)) {
        tracksToRemove.push({ uri: `spotify:track:${trackId}` });
        return;
      }

      newTrackList.push(trackId);
      return;
    });

    return {
      tracksToRemove,
      newTrackList,
    };
  }
}
