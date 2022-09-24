import { ServerService } from '../server.service';
import { serverConfig } from '../config';

export const makeServer = (): ServerService => {
    return new ServerService(serverConfig);
};
