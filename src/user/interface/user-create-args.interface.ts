export interface IUserCreateArgs {
  id?: number;
  email: string;
  password: string;
  isActive: number;
  createdAt: Date;
}
