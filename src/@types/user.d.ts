export interface IUser {
  id: number;
  email: string;
  password: string;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
