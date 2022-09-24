import SpotifyWebApi from 'spotify-web-api-node';

export type Credentials = ConstructorParameters<typeof SpotifyWebApi>[0];

export type TrackIdentifier = {
    uri: SpotifyURI['track'];
};

export type SpotifyURI = {
    track: `spotify:track:${string}`;
};
