import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controller/user.controller";

export class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    const userController = container.resolve(UserController);

    this.router.post("/create", userController.createUser);
    this.router.post("/login", userController.login);
    // this.router.patch("/update", userController.updateTask);
  }

  getRouter() {
    return this.router;
  }
}
