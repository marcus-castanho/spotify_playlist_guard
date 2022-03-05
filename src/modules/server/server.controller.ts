import { Request, Response } from "express";
import { ServerService } from "./server.service";

export class ServerController {
  constructor(private readonly serverService: ServerService) {
    this.serverService.listen(process.env.PORT);
    this.getIndex();
  }

  getIndex() {
    this.serverService.router.get("/", async (req: Request, res: Response) => {
      res.status(200).send("The Guard Bot is on!");
    });
  }
}
