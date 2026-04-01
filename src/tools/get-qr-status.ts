import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const getQrStatusSchema = z.object({
  qr_id: z.string().describe("QR payment ID to check"),
});

export async function handleGetQrStatus(params: z.infer<typeof getQrStatusSchema>): Promise<string> {
  const result = await client.get(`/qr/payments/${params.qr_id}`);
  return JSON.stringify(result, null, 2);
}
