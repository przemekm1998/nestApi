export interface IUser {
  id: number;
  email: string;
  password: string;
  isAdmin: boolean;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
