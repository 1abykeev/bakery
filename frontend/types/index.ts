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

export interface SaleExpenseSnapshot {
  id: number;
  expense_name: string;
  cost: string;
}

export interface Sale {
  id: number;
  product_id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  total_price: string;
  client_name: string;
  client_phone: string;
  sold_at: string;
  expense_snapshots: SaleExpenseSnapshot[];
  created_at: string;
}

export interface WorkLog {
  id: number;
  staff: number;
  staff_name: string;
  date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  created_at: string;
}

export interface ClientPurchase {
  sale_id: number;
  date: string;
  product_name: string;
  quantity: number;
  total_price: string;
}

export interface Client {
  name: string;
  phone: string;
  total_spent: number;
  visit_count: number;
  last_visit: string;
  products: string[];
  purchases: ClientPurchase[];
}

// ── Analytics ──────────────────────────────────────────────────────────────

export interface DailyRevenue {
  date: string;     // "YYYY-MM-DD"
  revenue: number;
}

export interface TopProduct {
  name: string;
  units_sold: number;
  revenue: number;
}

export interface ExpenseBreakdown {
  name: string;
  total_cost: number;
}

export interface StaffSalary {
  name: string;
  profession: string;
  hours: number;
  salary: number;
  salary_hour: number;
}

export interface AnalyticsData {
  date_from: string;
  date_to: string;
  revenue: number;
  production_cost: number;
  salary_cost: number;
  net_profit: number;
  total_sales_count: number;
  unique_clients: number;
  daily_revenue: DailyRevenue[];
  top_products: TopProduct[];
  expense_breakdown: ExpenseBreakdown[];
  staff_salary: StaffSalary[];
}