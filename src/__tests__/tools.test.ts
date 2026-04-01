import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAuthTokenSchema } from "../tools/get-auth-token.js";
import { createPaymentSchema } from "../tools/create-payment.js";
import { getPaymentStatusSchema } from "../tools/get-payment-status.js";
import { refundPaymentSchema } from "../tools/refund-payment.js";
import { createRecurringSchema } from "../tools/create-recurring.js";
import { chargeRecurringSchema } from "../tools/charge-recurring.js";
import { createQrPaymentSchema } from "../tools/create-qr-payment.js";
import { getQrStatusSchema } from "../tools/get-qr-status.js";

describe("halyk-epay-mcp schemas", () => {
  it("validates get_auth_token (empty params)", () => {
    const valid = getAuthTokenSchema.safeParse({});
    expect(valid.success).toBe(true);
  });

  it("validates create_payment params", () => {
    const valid = createPaymentSchema.safeParse({
      amount: 50000,
      currency: "KZT",
      order_id: "ORD-001",
      description: "Test payment",
      return_url: "https://example.com/return",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects create_payment with negative amount", () => {
    const invalid = createPaymentSchema.safeParse({
      amount: -100,
      order_id: "ORD-001",
      return_url: "https://example.com/return",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates get_payment_status params", () => {
    const valid = getPaymentStatusSchema.safeParse({ order_id: "ORD-001" });
    expect(valid.success).toBe(true);
  });

  it("validates refund_payment params", () => {
    const valid = refundPaymentSchema.safeParse({
      order_id: "ORD-001",
      amount: 25000,
      reason: "Customer request",
    });
    expect(valid.success).toBe(true);
  });

  it("validates create_recurring params", () => {
    const valid = createRecurringSchema.safeParse({
      amount: 10000,
      customer_id: "cust_123",
      description: "Monthly subscription",
    });
    expect(valid.success).toBe(true);
  });

  it("validates charge_recurring params", () => {
    const valid = chargeRecurringSchema.safeParse({
      subscription_id: "sub_abc",
      amount: 10000,
    });
    expect(valid.success).toBe(true);
  });

  it("validates create_qr_payment params", () => {
    const valid = createQrPaymentSchema.safeParse({
      amount: 5000,
      order_id: "ORD-QR-001",
    });
    expect(valid.success).toBe(true);
  });

  it("validates get_qr_status params", () => {
    const valid = getQrStatusSchema.safeParse({ qr_id: "qr_123" });
    expect(valid.success).toBe(true);
  });

  it("rejects create_payment with invalid return_url", () => {
    const invalid = createPaymentSchema.safeParse({
      amount: 5000,
      order_id: "ORD-001",
      return_url: "not-a-url",
    });
    expect(invalid.success).toBe(false);
  });
});

describe("HalykClient", () => {
  beforeEach(() => {
    vi.stubEnv("HALYK_TERMINAL_ID", "");
    vi.stubEnv("HALYK_CLIENT_ID", "");
    vi.stubEnv("HALYK_CLIENT_SECRET", "");
  });

  it("throws when credentials are missing", async () => {
    const { HalykClient } = await import("../client.js");
    expect(() => new HalykClient()).toThrow("HALYK_TERMINAL_ID");
  });
});
