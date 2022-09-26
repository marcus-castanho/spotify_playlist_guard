import { makeLogger } from '../../logger';
import { makeApiClient } from '../../api';
import { ProducerService } from '../../rabbitmq';
import { makeSpotifyApiClient } from '../../spotify';
import { schedulerConfig } from '../config';
import { GuardBotService } from '../guard-bot.service';

export const makeGuardBot = (producerService: ProducerService) => {
    return new GuardBotService(
        schedulerConfig,
        makeApiClient(),
        makeSpotifyApiClient(),
        producerService,
        makeLogger('guard-bot'),
    );
};
