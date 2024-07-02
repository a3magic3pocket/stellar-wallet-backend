import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IUserCreateArgs } from "./interface/user-create-args.interface";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: number;

  @Column()
  createdAt: Date;
}
