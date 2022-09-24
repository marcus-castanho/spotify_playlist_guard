import { SpotifyService } from '../spotify.service';
import { clientConfig } from '../config';

export const makeSpotifyApiClient = () => {
    return new SpotifyService(clientConfig);
};
