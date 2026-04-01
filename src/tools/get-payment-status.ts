import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const getPaymentStatusSchema = z.object({
  order_id: z.string().describe("Merchant order ID to check"),
});

export async function handleGetPaymentStatus(params: z.infer<typeof getPaymentStatusSchema>): Promise<string> {
  const result = await client.get(`/payments/${params.order_id}`);
  return JSON.stringify(result, null, 2);
}
