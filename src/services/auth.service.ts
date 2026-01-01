import {
  LoginResponse,
  LoginRequest,
  User,
  SignupRequest,
  SignupResponse,
  OTPRequest,
  OTPResponse,
  ResendRequest,
  ResendResponse,
  forgotPasswordRequest,
  forgotPasswordResponse,
  resetPasswordRequest,
  resetPasswordResponse,
  logoutResponse,
} from "@/types/auth.types";
import { PrivateChat } from "@/types/chat.types";
import api from "@/utils/axios";

export const useAuthService = {
  getMeRequest: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data.user;
  },

  refreshTokenRequest: async (): Promise<string> => {
    const res = await api.post("/auth/refresh-token");
    return res.data.accessToken;
  },

  loginRequest: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  signupRequest: async (data: SignupRequest): Promise<SignupResponse> => {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  verifyOTPRequest: async (data: OTPRequest): Promise<OTPResponse> => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  },

  resendOTPRequest: async (data: ResendRequest): Promise<ResendResponse> => {
    const res = await api.post("/auth/resend-otp", data);
    return res.data;
  },

  forgotPasswordRequest: async (
    data: forgotPasswordRequest
  ): Promise<forgotPasswordResponse> => {
    const res = await api.post("/auth/forgot-password", data);
    return res.data;
  },

  resetPasswordRequest: async (
    data: resetPasswordRequest
  ): Promise<resetPasswordResponse> => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  updateProfileRequest: async (
   formData: FormData
  ): Promise<PrivateChat> => {
    const res = await api.post("/users/update-profile", formData);
   
    return res.data.data;
  },

  logoutRequest: async (): Promise<logoutResponse> => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};
