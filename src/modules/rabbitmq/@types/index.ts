export type QueueOptions = 'guard-bot-queue';

export type BrokerConfig = {
    url: string;
    queues: QueueOptions[];
};

export type ProducerConfig = {
    queue: QueueOptions;
};

export type ConsumerConfig = {
    queue: QueueOptions;
};
