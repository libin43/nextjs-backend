export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
  }
  
  export interface CreateUserInputType {
    fname: string;
    lname: string;
    mobile: string;
    email: string;
    password: string;
    role: UserRole;
  }
  