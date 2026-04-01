import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const createQrPaymentSchema = z.object({
  amount: z.number().positive().describe("QR payment amount in minor units"),
  order_id: z.string().describe("Merchant order ID"),
});

export async function handleCreateQrPayment(params: z.infer<typeof createQrPaymentSchema>): Promise<string> {
  const result = await client.post("/qr/payments", {
    amount: params.amount,
    order_id: params.order_id,
    terminal_id: client.getTerminalId(),
  });
  return JSON.stringify(result, null, 2);
}
