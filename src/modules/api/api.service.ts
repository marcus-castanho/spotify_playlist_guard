import axios, { AxiosInstance } from "axios";
import { Playlist } from "src/@types/spotify-playlist-guard";

export class ApiClientService {
  private readonly baseUrl: string;
  private readonly httpClient: AxiosInstance;
  private readonly clientId = process.env.API_CLIENT_ID;
  private readonly clientKey = process.env.API_CLIENT_KEY;

  constructor() {
    this.baseUrl = process.env.API_URL;
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: { Authorization: this.clientKey },
      params: { CLIENT_ID : this.clientId },
    });
  }

  async getActivePlaylists(): Promise<Playlist[]> {
    const playlists: Playlist[] = (
      await this.httpClient.get("/playlists/findAll/active").catch((error) => {
        throw error;
      })
    ).data;

    return playlists;
  }

  async updatePlaylist(
    id: string,
    properties: Partial<Playlist>
  ): Promise<void> {
    await this.httpClient.patch(`/playlists/update/${id}`, {
      ...properties,
    });
  }
}
