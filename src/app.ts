import "reflect-metadata";
import "express-async-errors";
import express, { Application } from "express";
import { TaskRouter } from "./routes/task.router";
import { UserRouter } from "./routes/user.router";
import { errorMiddleware } from "./middlewares/error";
import { getDataSource } from "./database/dataSource";
import { authMiddleware } from "./middlewares/auth";

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.afterRoutesConfig();
  }

  config() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use("/api/v1/taskList/user", new UserRouter().getRouter());
    this.app.use(
      "/api/v1/taskList",
      authMiddleware,
      new TaskRouter().getRouter()
    );
  }

  afterRoutesConfig() {
    this.app.use(errorMiddleware);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      getDataSource()
        .initialize()
        .then(() => console.log("Data Source has been initialized!"))
        .catch((err) =>
          console.error("Error during Data Source initialization", err)
        );
      console.log("API Started!");
    });
  }
}
