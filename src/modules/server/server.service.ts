import express, { Express, Router } from 'express';
import cors from 'cors';
import { ServerConfig } from './@types';
import morgan from 'morgan';
import { LoggerService } from '../logger';

export class ServerService {
    private readonly app: Express;

    private readonly router: Router;

    constructor(
        private readonly serverConfig: ServerConfig,
        private readonly loggerService: LoggerService,
    ) {
        this.app = express();
        this.router = express.Router();
        this.setupMiddlewares();
        this.setupRoutes();
        this.listen(this.serverConfig.port);
    }

    setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors({ ...this.serverConfig.corsOptions }));
        this.app.use(morgan('dev'));
    }

    setupRoutes() {
        this.app.use('/', this.router);
        this.app.use('/', express.static('public'));
    }

    listen(port: string) {
        this.app.listen(port);
        this.loggerService.log(`Listening on port ${port}`);
    }
}
