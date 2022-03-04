import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyService extends SpotifyWebApi {
  constructor() {
    super({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.CALLBACK_URL,
    });
  }

  async setTokens(refreshToken: string): Promise<void> {
    this.setRefreshToken(refreshToken);

    await this.refreshAccessToken().then((data) => {
      this.setAccessToken(data.body.access_token);
    });
  }

  async getPlaylistData(
    id: string
  ): Promise<SpotifyApi.SinglePlaylistResponse> {
    const playlist = await this.getPlaylist(id).catch((error) => {
      throw error;
    });

    return playlist.body;
  }
}
