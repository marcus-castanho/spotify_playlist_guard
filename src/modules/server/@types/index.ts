import e from 'cors';

export type ServerConfig = {
    port: string;
    corsOptions: e.CorsOptions;
};
