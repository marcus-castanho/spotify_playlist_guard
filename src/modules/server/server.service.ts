import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import path from 'path';
import { serverConfig as config } from './config';

export class ServerService {
    public readonly app: Express;
    public readonly router: Router;

    constructor(private readonly serverConfig: typeof config) {
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
