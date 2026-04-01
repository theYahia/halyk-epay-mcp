import { z } from "zod";
import { HalykClient } from "../client.js";

const client = new HalykClient();

export const getAuthTokenSchema = z.object({});

export async function handleGetAuthToken(_params: z.infer<typeof getAuthTokenSchema>): Promise<string> {
  const token = await client.getToken();
  return JSON.stringify({
    message: "Auth token obtained successfully",
    token_preview: token.substring(0, 20) + "...",
    terminal_id: client.getTerminalId(),
  }, null, 2);
}
