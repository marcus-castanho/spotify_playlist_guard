import { AppService } from "./modules";

(function bootstrap() {
  AppService.getInstance()
    .startAsyncModules()
    .then((appInstance) => {
      appInstance.startApp();
    })
    .catch(() => {
      console.log("Failed to start the app.");
    });
})();
