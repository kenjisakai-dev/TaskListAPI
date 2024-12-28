import { container, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@helpers/apiError";
import { UserRepository } from "@repositories/user.repository";
import { IUser } from "@interface/user.interface";
import { IAuthLogin } from "@interface/auth.interface";
import { createToken } from "@helpers/auth";

@injectable()
export class UserService {
  async createUser(user: IUser) {
    const userRepository = container.resolve(UserRepository);
    const getUser = await userRepository.getUserByEmail(user.email);

    if (getUser) {
      throw new BadRequestError("E-mail já cadastrado.");
    }

    const hashPassword = await bcrypt.hash(user.password, 10);

    user.password = hashPassword;

    const { cod_user } = await userRepository.createUser(user);

    const token = createToken({ cod_user });

    return token;
  }

  async login(user: IAuthLogin) {
    const userRepository = container.resolve(UserRepository);
    const getUser = await userRepository.getUserByEmail(user.email);

    if (!getUser) {
      throw new UnauthorizedError("Login Inválido.");
    }

    const comparePassword = await bcrypt.compare(
      user.password,
      getUser.password
    );

    if (!comparePassword) {
      throw new UnauthorizedError("Login Inválido.");
    }

    const token = createToken({ cod_user: getUser.cod_user });

    return token;
  }

  async getUserByCod(cod_user: number) {
    const userRepository = container.resolve(UserRepository);
    const user = await userRepository.getUserByCod(cod_user);

    if (!user) {
      throw new NotFoundError("O usuário não foi encontrado.");
    }

    return user;
  }
}
