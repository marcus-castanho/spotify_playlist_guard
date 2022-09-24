import { producerConfig } from '../config';
import { ProducerService } from '../jobs/producer.service';
import { RabbitMQService } from '../rabbitmq.service';

export const makeProducer = (broker: RabbitMQService) => {
    return new ProducerService(producerConfig, broker);
};
