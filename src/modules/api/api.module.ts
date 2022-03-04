import { Credentials } from "src/@types/spotify-playlist-guard";
import { ApiClientService } from "./api.service";

const credentials: Credentials = {
  clientId: process.env.API_CLIENT_ID,
  clientKey: process.env.API_CLIENT_KEY,
};

const apiService = new ApiClientService(credentials);

export { apiService };
