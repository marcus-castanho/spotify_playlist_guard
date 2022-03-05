import "dotenv/config";
import { serverController } from "./modules/server/server.module";
import { guardBotService } from "./modules/guard-bot/guard-bot.module";

function bootsrap(): void {
  const bot = guardBotService;
  const server = serverController;
}

bootsrap();
