import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const refundPaymentSchema = z.object({
  order_id: z.string().describe("Order ID to refund"),
  amount: z.number().positive().describe("Refund amount in minor units"),
  reason: z.string().optional().describe("Refund reason"),
});

export async function handleRefundPayment(params: z.infer<typeof refundPaymentSchema>): Promise<string> {
  const result = await client.post(`/payments/${params.order_id}/refund`, {
    amount: params.amount,
    reason: params.reason,
  });
  return JSON.stringify(result, null, 2);
}
