import { Connection, connect, Channel, Message } from 'amqplib';
import { BrokerConfig } from './@types';

export class RabbitMQService {
    private static instance?: RabbitMQService;

    private connection?: Connection;

    private channel?: Channel;

    private constructor(
        private readonly url: string,
        private readonly queues: string[],
    ) {}

    public static async build(brokerConfig: BrokerConfig) {
        const { url, queues } = brokerConfig;

        if (RabbitMQService.instance) return RabbitMQService.instance;

        const classInstance = new RabbitMQService(url, queues);
        RabbitMQService.instance = classInstance;

        await classInstance
            .start()
            .then(() => classInstance.registerQueues())
            .catch((error) => {
                throw error;
            });

        return classInstance;
    }

    private async start() {
        this.connection = await connect(this.url);
        this.channel = await this.connection.createChannel();
    }

    private async registerQueues() {
        const { queues } = this;
        for (let i = 0; i < queues.length; i++) {
            if (!this.channel) break;
            await this.channel.assertQueue(queues[i], { durable: false });
        }
    }

    publishInQueue(queue: string, message: string) {
        if (!this.channel) return;
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    async consume(queue: string, callback: (message: Message) => void) {
        if (!this.channel) return;
        await this.channel.consume(queue, (message) => {
            if (!message) return;
            callback(message);

            if (!this.channel) return;
            this.channel.ack(message);
        });
    }
}
