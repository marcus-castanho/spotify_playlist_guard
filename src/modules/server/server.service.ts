import express, { Express, Request, Response, Router } from "express";
import cors from "cors";

export class ServerService {
  public readonly app: Express;
  public readonly router: Router;

  constructor() {
    this.app = express();
    this.router = express.Router();

    this.app.use(express.json()).use(cors()).use("/", this.router);
  }

  listen(port: string): void {
    this.app.listen(port);
  }
}
