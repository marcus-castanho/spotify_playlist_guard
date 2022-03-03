import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { Playlist } from "./@types/spotify-playlist-guard";
import { ApiClientService } from "./services/api/api.service";
import { SpotifyService } from "./services/spotify/spotify.service";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json()).use(cors()).use("/", router);

const apiService = new ApiClientService({
  clientId: process.env.API_CLIENT_ID,
  clientKey: process.env.API_CLIENT_KEY,
});

const spotifyService = new SpotifyService();

console.log(apiService, spotifyService);
console.log(process.env.CALLBACK_URL as string);

const botCronJob = cron.schedule(
  "0 * * * * *",
  async () => {
    const playlists = await apiService.getActivePlaylists();

    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
      const { id, allowed_userIds, owner, snapshot_id } = playlist;
      const { refreshToken } = owner;
      const tracksToRemove: any[] = [];
      const newTracks: string[] = [];
      let currSnapshotId: string;

      spotifyService.setRefreshToken(refreshToken);

      await spotifyService.refreshAccessToken().then((data) => {
        spotifyService.setAccessToken(data.body.access_token);
      });

      await spotifyService.getPlaylist(id).then(
        (data) => {
          const tracks = data.body.tracks.items;
          currSnapshotId = data.body.snapshot_id;

          if (currSnapshotId !== snapshot_id) {
            tracks.forEach((track) => {
              const userId = track.added_by.id;
              const trackId = track.track.id;

              if (!allowed_userIds.includes(userId)) {
                tracksToRemove.push({ uri: `spotify:track:${trackId}` });
                return;
              }

              newTracks.push(trackId);
              return;
            });
          }
        },
        (err) => {
          throw err;
        }
      );

      console.log(currSnapshotId, snapshot_id);

      if (currSnapshotId !== snapshot_id) {
        await spotifyService.removeTracksFromPlaylist(
          playlist.id,
          tracksToRemove
        );

        await apiService.updatePlaylist(id, {
          snapshot_id: currSnapshotId,
          tracks: newTracks,
        });
      }
    }
  },
  {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  }
);

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send("The Guard Bot is on!");
});

app.listen(process.env.PORT);
