import { SpotifyService } from '../spotify.service';
import { clientConfig } from '../config';

export const makeSpotifyApiClient = (): SpotifyService => {
    return new SpotifyService(clientConfig);
};
