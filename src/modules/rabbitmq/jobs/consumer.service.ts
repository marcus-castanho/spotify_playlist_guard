import { Playlist } from "src/@types/spotify-playlist-guard";
import { GuardBotService } from "src/modules/guard-bot";
import { RabbitMQService } from "../rabbitmq.service";

export class ConsumerService {
  private readonly queue: string;

  private constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly guardBotService: GuardBotService
  ) {
    this.queue = "guard-bot-queue";
  }

  public static async build(
    rabbitMQService: RabbitMQService,
    guardBotService: GuardBotService
  ): Promise<ConsumerService> {
    const classInstance = new ConsumerService(rabbitMQService, guardBotService);

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
