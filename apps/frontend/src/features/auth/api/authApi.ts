import apiClient from "@/api/apiClient";
import type {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  SignupResponse,
} from "../types";

export const authApiLogin = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post<AuthResponse>(
      "/user/signin",
      credentials,
    );
    return data;
  },
  checkMembership: async () => {
    const { data } = await apiClient.get("/membership/my-organizations");
    return data;
  },
};

export const authApiSignup = {
  signup: async (credentials: SignupCredentials) => {
    const { data } = await apiClient.post<SignupResponse>(
      "/user/signup",
      credentials,
    );
    return data;
  },
};
