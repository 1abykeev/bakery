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

export interface Expense {
  id: number;
  name: string;
  created_at: string;
}

export interface ProductExpense {
  id: number;
  expense_id: number;
  expense_name: string;
  cost: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  expenses: ProductExpense[];
  created_at: string;
}