import SpotifyWebApi from 'spotify-web-api-node';

export type Credentials = ConstructorParameters<typeof SpotifyWebApi>[0];
