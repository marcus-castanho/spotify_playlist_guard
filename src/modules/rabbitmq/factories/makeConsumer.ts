import { makeGuardBot } from '../../guard-bot';
import { ConsumerService } from '../jobs/consumer.service';
import { RabbitMQService } from '../rabbitmq.service';
import { makeProducer } from './makeProducer';

export const makeConsumer = async (broker: RabbitMQService) => {
    const producer = makeProducer(broker);
    const gaurdBot = makeGuardBot(producer);
    return ConsumerService.build(broker, gaurdBot);
};
