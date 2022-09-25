import express, { Express, Router } from 'express';
import cors from 'cors';
import { ServerConfig } from './@types';

export class ServerService {
    public readonly app: Express;

    public readonly router: Router;

    constructor(private readonly serverConfig: ServerConfig) {
        this.app = express();
        this.router = express.Router();
        this.setupMiddlewares();
        this.setupRoutes();
        this.listen(this.serverConfig.port);
    }

    setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(cors());
    }

    setupRoutes() {
        this.app.use('/', this.router);
        this.app.use('/', express.static('public'));
    }

    listen(port: string) {
        this.app.listen(port);
    }
}
