import { apiService } from "../api/api.module";
import { producerService } from "../rabbitmq/rabbitmq.module";
import { spotifyService } from "../spotify/spotify.module";
import { GuardBotService } from "./guard-bot.service";

const guardBotService = new GuardBotService(
  apiService,
  spotifyService,
  producerService
);

export { guardBotService };
