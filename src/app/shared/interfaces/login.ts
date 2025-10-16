export interface LoginRequest {
  email: string;
  password: string;
  device: string;
}

export interface LoginResponse {
  token: string;
}