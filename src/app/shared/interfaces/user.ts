export interface User {
  id: number;
  username: string;
  status?: string | null;
  status_message?: string | null;
  active?: boolean;
  last_active?: string | null;
  created_at?: unknown;
  updated_at?: unknown;
  deleted_at?: unknown;
}
