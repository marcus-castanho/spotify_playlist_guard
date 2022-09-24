import SpotifyWebApi from 'spotify-web-api-node';
import { Credentials } from './@types';

export class SpotifyService extends SpotifyWebApi {
    constructor(clientConfig: Credentials) {
        super(clientConfig);
    }

    async setTokens(refreshToken: string): Promise<void> {
        this.setRefreshToken(refreshToken);

        await this.refreshAccessToken().then((data) => {
            this.setAccessToken(data.body.access_token);
        });
    }

    async getPlaylistData(
        id: string,
    ): Promise<SpotifyApi.SinglePlaylistResponse> {
        const playlist = await this.getPlaylist(id).catch((error) => {
            throw error;
        });

        return playlist.body;
    }
}
