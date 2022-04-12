import { appService } from "./modules/app.module";

async function bootstrap(): Promise<void> {
  await appService.startModules();
}

bootstrap();
