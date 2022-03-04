import { apiService } from "../api/api.module";
import { spotifyService } from "../spotify/spotify.module";
import { GuardBotService } from "./guard-bot.service";

const guardBotService = new GuardBotService(apiService, spotifyService);

export { guardBotService };
