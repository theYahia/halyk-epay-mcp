#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getAuthTokenSchema, handleGetAuthToken } from "./tools/get-auth-token.js";
import { createPaymentSchema, handleCreatePayment } from "./tools/create-payment.js";
import { getPaymentStatusSchema, handleGetPaymentStatus } from "./tools/get-payment-status.js";
import { refundPaymentSchema, handleRefundPayment } from "./tools/refund-payment.js";
import { createRecurringSchema, handleCreateRecurring } from "./tools/create-recurring.js";
import { chargeRecurringSchema, handleChargeRecurring } from "./tools/charge-recurring.js";
import { createQrPaymentSchema, handleCreateQrPayment } from "./tools/create-qr-payment.js";
import { getQrStatusSchema, handleGetQrStatus } from "./tools/get-qr-status.js";

const server = new McpServer({ name: "halyk-epay-mcp", version: "1.0.0" });

server.tool("get_auth_token", "Get OAuth2 auth token from Halyk ePay.", getAuthTokenSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetAuthToken(params) }] }));

server.tool("create_payment", "Create a new payment via Halyk ePay.", createPaymentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreatePayment(params) }] }));

server.tool("get_payment_status", "Get payment status by order ID.", getPaymentStatusSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetPaymentStatus(params) }] }));

server.tool("refund_payment", "Refund a payment by order ID.", refundPaymentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleRefundPayment(params) }] }));

server.tool("create_recurring", "Create a recurring payment subscription.", createRecurringSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateRecurring(params) }] }));

server.tool("charge_recurring", "Charge a recurring subscription.", chargeRecurringSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleChargeRecurring(params) }] }));

server.tool("create_qr_payment", "Create a QR code payment.", createQrPaymentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateQrPayment(params) }] }));

server.tool("get_qr_status", "Check QR payment status.", getQrStatusSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetQrStatus(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[halyk-epay-mcp] Server started. 8 tools registered.");
}

main().catch((error) => { console.error("[halyk-epay-mcp] Error:", error); process.exit(1); });
