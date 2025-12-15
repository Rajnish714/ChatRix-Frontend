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


export interface SignupRequest {
  username:string;
  email: string;
  password: string;
  profile:string | null;

}

export interface SignupResponse {
  message: string;
  otpSession: string;
  
}

export interface OTPRequest {
    otp:string;
    otpSession:string
  
}

export interface OTPResponse {
   message: string;
   user: User;
 
}

export interface ResendRequest {
  otpSession:string;
 
}
export interface ResendResponse {
   message: string;
   otpSession:string;
 
}

export interface forgotPasswordRequest {
  email: string;
}
export interface forgotPasswordResponse {
   message: string;
   otpSession:string;
}


export interface resetPasswordRequest {
 
 otp:string;
 otpSession:string;
newPassword:string;
 
}

export interface resetPasswordResponse {
 message:string;
 }


export interface logoutResponse {
 message:string;
 }

export interface ApiError {
  message: string;
}

