import { BrokerConfig } from '../@types';

export const brokerConfig: BrokerConfig = {
    url: process.env.CLOUDAMQP_URL || '',
    queues: ['guard-bot-queue'],
};
