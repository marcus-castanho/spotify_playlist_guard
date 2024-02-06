import { debug } from 'debug';
import { AppService } from './modules';

(function bootstrap() {
    const logger = debug('app:main');
    AppService.getInstance()
        .startAsyncModules()
        .then((appInstance) => {
            appInstance.startApp().then(() => {
                logger('Application is running.');
            });
        })
        .catch((error) => {
            logger('%j', {
                error: error.message,
                message: 'Failed to start the app. Retrying in 1 minute.',
                stack: error.stack,
            });
            setTimeout(() => {
                bootstrap();
            }, 60000);
        });
})();

import { readdir } from 'node:fs/promises';
import path from 'node:path';
/* eslint-disable no-console */

const pathStr = process.cwd(); //path.join(__dirname);

try {
    readdir(pathStr).then((dirContent) => {
        console.log(dirContent);
        if (dirContent.includes('public')) {
            readdir(path.join(pathStr, 'public')).then((content) =>
                console.log(content),
            );
        }
    });
} catch (err) {
    console.error(err);
}
