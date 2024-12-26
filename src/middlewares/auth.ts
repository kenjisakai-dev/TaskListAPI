import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../helpers/apiError";
import { verifyToken } from "../helpers/auth";
import { IUserPayload } from "../interface/user.interface";
import { container } from "tsyringe";
import { UserService } from "../services/user.service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    throw new UnauthorizedError("O token de acesso é obrigatório.");
  }

  const payload = verifyToken(token) as IUserPayload;

  const userService = container.resolve(UserService);
  const user = await userService.getUserByCod(payload.cod_user);

  req.body = { ...req.body, user };

  next();
};
