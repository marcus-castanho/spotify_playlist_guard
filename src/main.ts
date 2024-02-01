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
            appInstance.serverService.listen(process.env.PORT);
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
