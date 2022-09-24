import { Connection, connect, Channel, Message } from 'amqplib';
import { brokerConfig as config } from './config';

export class RabbitMQService {
    private static instance?: RabbitMQService;
    private connection: Connection;
    private channel: Channel;

    private constructor(
        private readonly url: string,
        private readonly queues: string[],
    ) {}

    public static async build(brokerConfig: typeof config) {
        const { url, queues } = brokerConfig;

        if (RabbitMQService.instance) return RabbitMQService.instance;

        const classInstance = new RabbitMQService(url, queues);
        RabbitMQService.instance = classInstance;

        await classInstance.start().then(() => {
            classInstance.registerQueues().catch((error) => {
                throw error;
            });
        });

        return classInstance;
    }

    private async start() {
        this.connection = await connect(this.url).catch((error) => {
            throw error;
        });
        this.channel = await this.connection.createChannel();
    }

    private async registerQueues() {
        const { queues } = this;
        for (let i = 0; i < queues.length; i++) {
            await this.channel.assertQueue(queues[i], { durable: false });
        }
    }

    publishInQueue(queue: string, message: string) {
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    async consume(queue: string, callback: (message: Message) => void) {
        await this.channel.consume(queue, (message) => {
            callback(message);
            this.channel.ack(message);
        });
    }
}
