import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { getDataSource } from "../database/dataSource";
import { User } from "../entities/user.entity";
import { IUser } from "../interface/user.interface";

@injectable()
export class UserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getDataSource().getRepository(User);
  }

  async createUser(user: IUser) {
    return await this.userRepository.save(user);
  }

  async getUserByCod(cod_user: number) {
    return await this.userRepository.findOneBy({ cod_user });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
