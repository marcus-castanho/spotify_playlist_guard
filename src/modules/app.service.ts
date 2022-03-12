import { ApiClientService } from "./api/api.service";
import { GuardBotService } from "./guard-bot/guard-bot.module";
import {
  ConsumerService,
  ProducerService,
  RabbitMQService,
} from "./rabbitmq/rabbitmq.module";
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
  }
}
