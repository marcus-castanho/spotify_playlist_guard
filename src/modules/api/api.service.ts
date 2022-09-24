import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Playlist } from './@types';
import { routes as apiRoutes } from './config';

export class ApiClientService {
    private readonly httpClient: AxiosInstance;

    constructor(
        private readonly clientConfig: AxiosRequestConfig,
        private readonly routes: typeof apiRoutes,
    ) {
        this.httpClient = axios.create(this.clientConfig);
    }

    async getActivePlaylists() {
        const { getAllActivePlaylists } = this.routes;
        const playlists: Playlist[] = (
            await this.httpClient.get(getAllActivePlaylists).catch((error) => {
                throw error;
            })
        ).data;

        return playlists;
    }

    async updatePlaylist(id: string, properties: Partial<Playlist>) {
        const { updatePlaylist } = this.routes;
        const routeWithParams = `${updatePlaylist}${id}`;
        await this.httpClient.patch(routeWithParams, {
            ...properties,
        });
    }
}
