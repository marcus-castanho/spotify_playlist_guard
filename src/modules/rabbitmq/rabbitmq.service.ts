import { Connection, connect, Channel, Message } from "amqplib";

export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;
  private url = process.env.RABBITMQ_URL;
  private queues = ["guard-bot-queue"];

  private constructor() {}

  public static async build(): Promise<RabbitMQService> {
    const classInstance = new RabbitMQService();

    await classInstance
      .start()
      .then(() => {
        classInstance.registerQueues(classInstance.queues);
      })
      .catch((error) => {
        throw error;
      });

    return classInstance;
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

  async consume(queue: string, callback: (message: Message) => void) {
    await this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });

    return;
  }
}
