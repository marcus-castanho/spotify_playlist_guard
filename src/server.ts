import "dotenv/config";
import { guardBotService } from "./modules/guard-bot/guard-bot.module";

function bootsrap(): void {
  const app = guardBotService;
}

bootsrap();
