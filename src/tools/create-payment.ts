import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const createPaymentSchema = z.object({
  amount: z.number().positive().describe("Payment amount in minor units (tiyin)"),
  currency: z.string().default("KZT").describe("Currency code (default: KZT)"),
  order_id: z.string().describe("Merchant order ID"),
  description: z.string().optional().describe("Payment description"),
  return_url: z.string().url().describe("URL to redirect after payment"),
});

export async function handleCreatePayment(params: z.infer<typeof createPaymentSchema>): Promise<string> {
  const result = await client.post("/payments", {
    amount: params.amount,
    currency: params.currency,
    order_id: params.order_id,
    description: params.description,
    terminal_id: client.getTerminalId(),
    post_link: params.return_url,
  });
  return JSON.stringify(result, null, 2);
}
