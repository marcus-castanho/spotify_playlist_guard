import { Playlist } from 'src/@types/spotify-playlist-guard';
import { RabbitMQService } from '../rabbitmq.service';
import { producerConfig as config } from '../config';

export class ProducerService {
    private readonly queue: string;

    constructor(
        producerConfig: typeof config,
        private readonly rabbitMQService: RabbitMQService,
    ) {
        this.queue = producerConfig.queue;
    }

    runGuardBot(playlist: Playlist): void {
        const playlistStr = JSON.stringify(playlist);

        this.rabbitMQService.publishInQueue(this.queue, playlistStr);
    }
}
