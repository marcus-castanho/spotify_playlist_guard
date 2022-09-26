import { debug } from 'debug';
import { loggerConfig } from '../config';
import { LoggerService } from '../logger.service';

export const makeLogger = (logSource = '') => {
    return new LoggerService(loggerConfig, logSource, debug);
};
