import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

const app = express();
const router = express.Router();
const spotifyRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN as string;

app
  .use(express.json())
  .use(cors())
  .use('/', router);

const botCronJob = cron.schedule('0 * * * * *', async () => {
  const allowedUsersIDs = ['31ronlkcdosn3x3kkuvez6vo2jyi'];
  const guardedPlaylistID = '5wkdAzv8ZArH5cyvXQTRYe';
  const tracksToRemove: any = [];
  const spotifyApiClient = new SpotifyWebApi(
    {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: `http://localhost:${process.env.PORT}/`,
    },
  );

  spotifyApiClient.setRefreshToken(spotifyRefreshToken);

  await spotifyApiClient.refreshAccessToken().then((data) => {
    spotifyApiClient.setAccessToken(data.body.access_token);
  });

  await spotifyApiClient.getPlaylist(guardedPlaylistID).then(
    (data) => {
      const tracksArr = data.body.tracks.items;

      tracksArr.forEach((track) => {
        const userId = track.added_by.id;

        if (!allowedUsersIDs.includes(userId)) {
          const trackId = track.track.id;
          tracksToRemove.push({ uri: `spotify:track:${trackId}` });
        }
      });
    },
    (err) => {
      throw err;
    },
  );

  await spotifyApiClient.removeTracksFromPlaylist(guardedPlaylistID, tracksToRemove);
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo',
});

router.get('/', async (req:Request, res:Response) => {
  res.status(200).send('The bot in on!');
});

app.listen(process.env.PORT);
