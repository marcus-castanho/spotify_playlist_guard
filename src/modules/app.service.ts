import { ApiClientService } from "./api";
import { GuardBotService } from "./guard-bot";
import { ConsumerService, ProducerService, RabbitMQService } from "./rabbitmq";
import { ServerService } from "./server";
import { SpotifyService } from "./spotify";

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
