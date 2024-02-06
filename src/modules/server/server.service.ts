import express, { Express, Router } from 'express';
import cors from 'cors';
import { ServerConfig } from './@types';
import morgan from 'morgan';
import { LoggerService } from '../logger';

import { readdir } from 'node:fs/promises';
import path from 'node:path';
/* eslint-disable no-console */

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

        const pathStr = process.cwd(); //path.join(__dirname);
        let data = {};

        try {
            readdir(pathStr).then((dirContent) => {
                data = { ...data, dirContent };
                console.log(dirContent);
                if (dirContent.includes('public')) {
                    readdir(path.join(pathStr, 'public')).then((content) => {
                        data = { ...data, content };
                        console.log(content);
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }

        this.app.use('/test', (req, res) =>
            res.status(200).json({ result: 'ok', data }),
        );
    }

    listen(port: string) {
        this.app.listen(port);
        this.loggerService.log(`Listening on port ${port}`);
    }
}
