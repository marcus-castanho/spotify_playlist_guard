import { Debug } from 'debug';
import { loggerConfig as config } from './config';

export class LoggerService {
    constructor(
        private readonly loggerConfig: typeof config,
        private readonly logSource: string,
        private readonly logger: Debug,
    ) {}

    log(formatter: any, ...args: any[]) {
        const { prefix } = this.loggerConfig;
        const { logSource } = this;
        this.logger(`${prefix}:${logSource}`)(formatter, ...args);
    }
}
