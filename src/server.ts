import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import { Playlist } from "./@types/spotify-playlist-guard";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json()).use(cors()).use("/", router);

const axiosInstace = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
  headers: { Authorization: process.env.API_CLIENT_KEY },
  params: { id: process.env.API_CLIENT_ID },
});

const spotifyApiClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:${process.env.PORT}/`,
});

const botCronJob = cron.schedule(
  "0 * * * * *",
  async () => {
    const playlists: Playlist[] = (
      await axiosInstace.get("/playlists/findAll/active").catch((error) => {
        throw error;
      })
    ).data;

    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
      const { id, allowed_userIds, owner, snapshot_id } = playlist;
      const { refreshToken } = owner;
      const tracksToRemove: any[] = [];
      const newTracks: string[] = [];
      let currSnapshotId: string;

      spotifyApiClient.setRefreshToken(refreshToken);

      await spotifyApiClient.refreshAccessToken().then((data) => {
        spotifyApiClient.setAccessToken(data.body.access_token);
      });

      await spotifyApiClient.getPlaylist(id).then(
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

      if (currSnapshotId !== snapshot_id) {
        await spotifyApiClient.removeTracksFromPlaylist(
          playlist.id,
          tracksToRemove
        );

        await axiosInstace.patch(`/playlists/update/${playlist.id}`, {
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
