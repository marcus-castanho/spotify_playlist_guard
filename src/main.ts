import { AppService } from './modules';

(function bootstrap() {
    AppService.getInstance()
        .startAsyncModules()
        .then((appInstance) => {
            appInstance
                .startApp()
                .then(() => console.log('Application is running.'));
        })
        .catch((error) => {
            console.log({
                error: error.message,
                message: 'Failed to start the app. Retrying in 1 minute.',
            });
            setTimeout(() => {
                bootstrap();
            }, 60000);
        });
})();
