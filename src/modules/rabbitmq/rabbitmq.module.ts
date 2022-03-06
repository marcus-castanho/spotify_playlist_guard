import { ProducerService } from "./jobs/producer.service";
import { RabbitMQService } from "./rabbitmq.service";

const rabbitMqUrl = process.env.RABBITMQ_URL;
const queues = ["guard-bot-queue"];

const rabbitMQService = new RabbitMQService(rabbitMqUrl, queues);
const producerService = new ProducerService(rabbitMQService);

export { producerService };
