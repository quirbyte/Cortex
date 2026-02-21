export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignupCredentials {
  username:string;
  email:string;
  password:string;
}

export interface SignupResponse{
  msg:string;
}