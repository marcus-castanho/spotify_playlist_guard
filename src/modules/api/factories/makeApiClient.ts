import { ApiClientService } from '../api.service';
import { clientConfig } from '../config';

export const makeApiClient = (): ApiClientService => {
    return new ApiClientService(clientConfig);
};
