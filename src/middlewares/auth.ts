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
  const getUser = await userService.getUserByCod(payload.cod_user);

  const { password, ...user } = getUser;

  req.body = { ...req.body, cod_user: user.cod_user, user };

  next();
};
