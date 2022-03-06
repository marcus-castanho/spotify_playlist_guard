import { Playlist } from "src/@types/spotify-playlist-guard";
import { RabbitMQService } from "../rabbitmq.service";

export class ProducerService {
  private readonly queue: string;

  constructor(private readonly rabbitMQService: RabbitMQService) {
    this.queue = "guard-bot-queue";
  }

  runGuardBot(playlist: Playlist): void {
    const playlistStr = JSON.stringify(playlist);

    this.rabbitMQService.publishInQueue(this.queue, playlistStr);
  }
}
