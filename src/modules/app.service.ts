import { ConsumerService, ProducerService, RabbitMQService } from './rabbitmq';
import { makeBroker, makeConsumer } from './rabbitmq/factories';
import { makeServer, ServerService } from './server';

export class AppService {
    private static instance?: AppService;
    private rabbitMQService: RabbitMQService;
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
        this.rabbitMQService = await makeBroker();
        this.consumerService = await makeConsumer(this.rabbitMQService);
        return this;
    }

    async startApp() {
        this.serverService = makeServer();
    }
}
