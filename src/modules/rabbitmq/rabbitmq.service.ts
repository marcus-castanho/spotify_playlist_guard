import { Connection, connect, Channel, Message } from "amqplib";

export class RabbitMQService {
  private connection: Connection;
  channel: Channel;

  constructor(private readonly url: string, private readonly queues: string[]) {
    this.start()
      .then(() => {
        this.registerQueues(queues);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private async start(): Promise<void> {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();

    return;
  }

  private async registerQueues(queues: string[]): Promise<void> {
    for (let i = 0; i < queues.length; i++) {
      await this.channel.assertQueue(queues[i], { durable: false });
    }

    return;
  }

  publishInQueue(queue: string, message: string): void {
    this.channel.sendToQueue(queue, Buffer.from(message));

    return;
  }
}
