// frontend/src/types/index.ts

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}


export interface Staff {
  id: number;
  name: string;
  phone: string;
  profession: string;
  salary_hour: string;
  created_at: string;
}