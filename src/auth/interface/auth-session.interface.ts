import { Session } from "express-session";
import { User } from "@src/user/user.entity";

export interface IAuthSession extends Session {
  user: User;
}
