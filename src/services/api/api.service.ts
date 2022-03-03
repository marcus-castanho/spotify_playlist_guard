import axios, { AxiosInstance } from "axios";
import { Credentials, Playlist } from "src/@types/spotify-playlist-guard";

export class ApiClientService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientKey: string;
  private readonly httpClient: AxiosInstance;

  constructor(credentials: Credentials) {
    this.clientId = credentials.clientId;
    this.clientKey = credentials.clientKey;
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: { Authorization: this.clientKey },
      params: { id: this.clientId },
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

  async updatePlaylist(id: string, properties: Partial<Playlist>) {
    await this.httpClient.patch(`/playlists/update/${id}`, {
      ...properties,
    });
  }
}
