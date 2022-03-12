import express, { Express, Request, Response, Router } from "express";
import cors from "cors";
import path from "path";

export class ServerService {
  public readonly app: Express;
  public readonly router: Router;

  constructor() {
    this.app = express();
    this.router = express.Router();

    this.app.use(express.json()).use(cors()).use("/", this.router);
    this.app.use("/", express.static("public"));

    this.app.listen(process.env.PORT);
  }

  listen(port: string): void {
    this.app.listen(port);
  }
}
