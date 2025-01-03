import { Router } from "express";
import { container } from "tsyringe";
import { TaskController } from "@controllers/task.controller";

export class TaskRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    const taskController = container.resolve(TaskController);

    this.router.post("/create", taskController.createTask);
    this.router.get("/getTasksByUser", taskController.getTasksByUser);
    this.router.patch("/update", taskController.updateTask);
  }

  getRouter() {
    return this.router;
  }
}
