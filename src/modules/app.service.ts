import { ApiClientService, makeApiClient } from './api';
import { GuardBotService } from './guard-bot';
import { ConsumerService, ProducerService, RabbitMQService } from './rabbitmq';
import { ServerService } from './server';
import { makeSpotifyApiClient, SpotifyService } from './spotify';

export class AppService {
    private static instance?: AppService;
    private rabbitMQService: RabbitMQService;
    private producerService: ProducerService;
    private apiService: ApiClientService;
    private spotifyService: SpotifyService;
    private guardBotService: GuardBotService;
    private consumerService: ConsumerService;
    private serverService: ServerService;

    constructor() {}

    static getInstance = () => {
        if (!AppService.instance) {
            AppService.instance = new AppService();
        }
        return AppService.instance;
    };

    async startAsyncModules() {
        this.rabbitMQService = await RabbitMQService.build();
        return this;
    }

    async startApp() {
        this.producerService = new ProducerService(this.rabbitMQService);
        this.apiService = makeApiClient();
        this.spotifyService = makeSpotifyApiClient();
        this.guardBotService = new GuardBotService(
            this.apiService,
            this.spotifyService,
            this.producerService,
        );
        this.consumerService = await ConsumerService.build(
            this.rabbitMQService,
            this.guardBotService,
        );
        this.serverService = new ServerService();
    }
}
