import { AxiosInstance } from 'axios';
import { Playlist } from './@types';
import { routes as apiRoutes } from './config';

export class ApiClientService {
    constructor(
        private readonly httpClient: AxiosInstance,
        private readonly routes: typeof apiRoutes,
    ) {}

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
