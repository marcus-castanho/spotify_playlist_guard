import { ServerConfig } from '../@types';

export const serverConfig: ServerConfig = {
    port: process.env.PORT || '8080',
    corsOptions: {
        origin: [process.env.APP_URL],
        methods: ['GET'],
    },
};
