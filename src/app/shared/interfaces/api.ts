export interface ApiMessages {
  [field: string]: string | string[];
}

export interface ApiErrorShape {
  status?: number;
  error?: number | string;
  messages?: ApiMessages | string;
  message?: string;
}