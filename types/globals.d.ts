import { User } from "./type";

export {};

declare global {
  // 繼承 User 型別，並可再之後擴展
  interface CustomJwtSessionClaims extends User {}
}
