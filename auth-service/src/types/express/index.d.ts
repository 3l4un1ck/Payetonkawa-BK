import { IUser } from "../../domain/types/user";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}