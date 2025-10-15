export interface LoginRequest {
  email: string;
  password: string;
  agent: string;
}

export interface LoginResponse {
  token: string;
}