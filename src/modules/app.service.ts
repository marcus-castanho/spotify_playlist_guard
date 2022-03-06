import { ApiClientService } from "./api/api.service";
import { GuardBotService } from "./guard-bot/guard-bot.module";
import {
  ConsumerService,
  ProducerService,
  RabbitMQService,
} from "./rabbitmq/rabbitmq.module";
import { ServerController } from "./server/server.controller";
import { ServerService } from "./server/server.service";
import { SpotifyService } from "./spotify/spotify.service";

export class AppService {
  private rabbitMQService: RabbitMQService;
  private producerService: ProducerService;
  private apiService: ApiClientService;
  private spotifyService: SpotifyService;
  private guardBotService: GuardBotService;
  private consumerService: ConsumerService;
  private serverService: ServerService;
  private serverController: ServerController;

  constructor() {}

  async startModules() {
    this.rabbitMQService = await RabbitMQService.build();
    this.producerService = new ProducerService(this.rabbitMQService);
    this.apiService = new ApiClientService();
    this.spotifyService = new SpotifyService();
    this.guardBotService = new GuardBotService(
      this.apiService,
      this.spotifyService,
      this.producerService
    );
    this.consumerService = await ConsumerService.build(
      this.rabbitMQService,
      this.guardBotService
    );
    this.serverService = new ServerService();
    this.serverController = new ServerController(this.serverService);
  }
}
