import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const createRecurringSchema = z.object({
  amount: z.number().positive().describe("Recurring payment amount in minor units"),
  customer_id: z.string().describe("Customer identifier"),
  description: z.string().optional().describe("Subscription description"),
});

export async function handleCreateRecurring(params: z.infer<typeof createRecurringSchema>): Promise<string> {
  const result = await client.post("/subscriptions", {
    amount: params.amount,
    customer_id: params.customer_id,
    description: params.description,
    terminal_id: client.getTerminalId(),
  });
  return JSON.stringify(result, null, 2);
}
