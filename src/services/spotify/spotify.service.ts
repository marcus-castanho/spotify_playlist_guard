import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyService extends SpotifyWebApi {
  constructor() {
    super({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.CALLBACK_URL,
    });
  }
}
