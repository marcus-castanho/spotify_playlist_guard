import { AxiosRequestConfig } from 'axios';

export const clientConfig: AxiosRequestConfig = {
    baseURL: process.env.API_URL,
    timeout: 5000,
    headers: { Authorization: process.env.API_CLIENT_KEY },
    params: { CLIENT_ID: process.env.API_CLIENT_ID },
};
