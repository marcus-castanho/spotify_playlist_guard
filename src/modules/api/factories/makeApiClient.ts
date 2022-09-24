import { ApiClientService } from '../api.service';
import { clientConfig, routes } from '../config';

export const makeApiClient = () => {
    return new ApiClientService(clientConfig, routes);
};
