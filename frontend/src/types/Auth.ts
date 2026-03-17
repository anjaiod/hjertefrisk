export type RegisterRole = "patient" | "personnel";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterUserInput = {
  role: RegisterRole;
  name: string;
  email: string;
  password: string;
};
