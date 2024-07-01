import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(user: User): Promise<User> {
    return this.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.findOneBy({ email });
  }
}
