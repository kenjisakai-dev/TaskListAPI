import { Request, Response } from "express";
import { container, injectable } from "tsyringe";
import { BadRequestError, UnauthorizedError } from "../helpers/apiError";
import { UserService } from "../services/user.service";
import { IUser } from "../interface/user.interface";
import { validatePassword } from "../helpers/validatePassword";
import { validateEmail } from "../helpers/validateEmail";
import { IAuthLogin } from "../interface/auth.interface";

@injectable()
export class UserController {
  async createUser(req: Request, res: Response) {
    const user: IUser = req.body;
    const { name, email, password } = user;

    if (!name || !email || !password) {
      throw new BadRequestError("O nome, email e senha são obrigatórios.");
    }

    validateEmail(email);
    validatePassword(password);

    const userService = container.resolve(UserService);
    const token = await userService.createUser(user);

    res.status(201).json(token);
  }

  async login(req: Request, res: Response) {
    const user: IAuthLogin = req.body;
    const { email, password } = user;

    if (!email || !password) {
      throw new UnauthorizedError("Login Inválido.");
    }
    const userService = container.resolve(UserService);
    const token = await userService.login(user);

    res.status(200).json(token);
  }
}
