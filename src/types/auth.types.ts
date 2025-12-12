export interface User {
  id: string;
  username: string;
  email: string;
 }
export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
}

