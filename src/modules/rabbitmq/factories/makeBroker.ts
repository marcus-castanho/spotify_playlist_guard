import { brokerConfig } from '../config';
import { RabbitMQService } from '../rabbitmq.service';

export const makeBroker = async () => {
    return RabbitMQService.build(brokerConfig);
};
