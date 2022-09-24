import axios from 'axios';
import { ApiClientService } from '../api.service';
import { clientConfig, routes } from '../config';

export const makeApiClient = () => {
    const clientInstace = axios.create(clientConfig);
    return new ApiClientService(clientInstace, routes);
};
