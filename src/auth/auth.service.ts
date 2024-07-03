import { Injectable } from "@nestjs/common";
import { UserService } from "@src/user/user.service";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user === null) {
      return null;
    }

    const isOkPassword = await this.userService.comparePasswords(
      password,
      user.password
    );
    if (isOkPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
