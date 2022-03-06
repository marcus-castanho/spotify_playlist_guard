import { appService } from "./modules/app.module";

async function bootsrap(): Promise<void> {
  await appService.startModules();
}

bootsrap();
