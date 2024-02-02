import { ServerService } from '../server.service';
import { serverConfig } from '../config';
import { makeLogger } from '../../logger';

export const makeServer = () => {
    return new ServerService(serverConfig, makeLogger('server'));
};
