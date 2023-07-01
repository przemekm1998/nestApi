import { IUser } from './user';

declare global {
  namespace Express {
    interface User extends IUser {
      id: number;
      email: string;
      password: string;
    }
  }
}

export { IUser };
