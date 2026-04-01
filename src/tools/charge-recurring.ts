import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const chargeRecurringSchema = z.object({
  subscription_id: z.string().describe("Subscription ID to charge"),
  amount: z.number().positive().describe("Charge amount in minor units"),
});

export async function handleChargeRecurring(params: z.infer<typeof chargeRecurringSchema>): Promise<string> {
  const result = await client.post(`/subscriptions/${params.subscription_id}/charge`, {
    amount: params.amount,
  });
  return JSON.stringify(result, null, 2);
}
