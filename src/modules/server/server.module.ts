import { ServerController } from "./server.controller";
import { ServerService } from "./server.service";

const serverService = new ServerService();
const serverController = new ServerController(serverService);

export { serverController };
