import { ServerConfig } from '../@types';

export const serverConfig: ServerConfig = {
    port: process.env.PORT || '3030',
    corsOptions: {
        origin: [process.env.APP_URL],
        methods: ['GET'],
    },
};
