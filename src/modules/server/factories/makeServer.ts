import { ServerService } from '../server.service';
import { serverConfig } from '../config';

export const makeServer = () => {
    return new ServerService(serverConfig);
};
