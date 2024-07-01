import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { IUserCreateArgs } from "./interface/user-create-args.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userCreateArgs: IUserCreateArgs): Promise<User> {
    userCreateArgs.password = await this.hashPassword(userCreateArgs.password);
    return this.userRepository.save(userCreateArgs);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByEmail(email);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }
}
