import { Playlist } from '../../api/@types';
import { GuardBotService } from 'src/modules/guard-bot';
import { QueueOptions } from '../@types';
import { RabbitMQService } from '../rabbitmq.service';
import { consumerConfig as config } from '../config';

export class ConsumerService {
    private static instance?: ConsumerService;
    private readonly queue: QueueOptions;

    private constructor(
        consumerConfig: typeof config,
        private readonly rabbitMQService: RabbitMQService,
        private readonly guardBotService: GuardBotService,
    ) {
        this.queue = consumerConfig.queue;
    }

    public static async build(
        rabbitMQService: RabbitMQService,
        guardBotService: GuardBotService,
    ) {
        if (ConsumerService.instance) return ConsumerService.instance;
        const classInstance = new ConsumerService(
            config,
            rabbitMQService,
            guardBotService,
        );
        ConsumerService.instance = classInstance;

        await classInstance.runGuardBotJob();

        return classInstance;
    }

    async runGuardBotJob(): Promise<void> {
        await this.rabbitMQService.consume(this.queue, (message) => {
            const playlist: Playlist = JSON.parse(message.content.toString());
            this.guardBotService.runGuard(playlist);
        });
    }
}
