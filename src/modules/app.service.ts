import { GuardBotService, makeGuardBot } from './guard-bot';
import { ConsumerService, ProducerService, RabbitMQService } from './rabbitmq';
import { makeServer, ServerService } from './server';

export class AppService {
    private static instance?: AppService;
    private rabbitMQService: RabbitMQService;
    private producerService: ProducerService;
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
        this.guardBotService = makeGuardBot(this.producerService);
        this.consumerService = await ConsumerService.build(
            this.rabbitMQService,
            this.guardBotService,
        );
        this.serverService = makeServer();
    }
}
