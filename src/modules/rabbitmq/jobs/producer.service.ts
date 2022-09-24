import { Playlist } from '../../api/@types';
import { RabbitMQService } from '../rabbitmq.service';
import { ProducerConfig } from '../@types';

export class ProducerService {
    private readonly queue: string;

    constructor(
        producerConfig: ProducerConfig,
        private readonly rabbitMQService: RabbitMQService,
    ) {
        this.queue = producerConfig.queue;
    }

    runGuardBot(playlist: Playlist): void {
        const playlistStr = JSON.stringify(playlist);

        this.rabbitMQService.publishInQueue(this.queue, playlistStr);
    }
}
