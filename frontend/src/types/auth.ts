export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
