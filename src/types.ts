export interface HalykPayment {
  id: string;
  amount: number;
  currency: string;
  order_id: string;
  description?: string;
  status: string;
  created_at: string;
  terminal_id: string;
}

export interface HalykAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface HalykQrPayment {
  qr_id: string;
  qr_image: string;
  amount: number;
  status: string;
  order_id: string;
}

export interface HalykRecurring {
  subscription_id: string;
  customer_id: string;
  amount: number;
  status: string;
  description?: string;
}

export interface HalykError {
  error?: {
    code: string;
    message: string;
  };
}
