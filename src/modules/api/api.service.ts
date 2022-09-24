import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Playlist } from 'src/@types/spotify-playlist-guard';
import { clientConfig } from './config';

export class ApiClientService {
    private readonly httpClient: AxiosInstance;

    constructor(private readonly clientConfig: AxiosRequestConfig) {
        this.httpClient = axios.create(this.clientConfig);
    }

    async getActivePlaylists(): Promise<Playlist[]> {
        const playlists: Playlist[] = (
            await this.httpClient
                .get('/playlists/findAll/active')
                .catch((error) => {
                    throw error;
                })
        ).data;

        return playlists;
    }

    async updatePlaylist(
        id: string,
        properties: Partial<Playlist>,
    ): Promise<void> {
        await this.httpClient.patch(`/playlists/update/${id}`, {
            ...properties,
        });
    }
}
