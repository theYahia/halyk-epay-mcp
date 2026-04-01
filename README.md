# halyk-epay-mcp

MCP server for Halyk Bank ePay payment gateway (Kazakhstan). Supports online payments, QR payments, recurring subscriptions, and refunds.

## Tools (8)

| Tool | Description |
|------|-------------|
| `get_auth_token` | Get OAuth2 authentication token |
| `create_payment` | Create a new online payment |
| `get_payment_status` | Check payment status by order ID |
| `refund_payment` | Refund a payment |
| `create_recurring` | Create a recurring subscription |
| `charge_recurring` | Charge a recurring subscription |
| `create_qr_payment` | Generate a QR code payment |
| `get_qr_status` | Check QR payment status |

## Quick Start

```json
{
  "mcpServers": {
    "halyk-epay": {
      "command": "npx",
      "args": ["-y", "@theyahia/halyk-epay-mcp"],
      "env": {
        "HALYK_TERMINAL_ID": "<YOUR_TERMINAL_ID>",
        "HALYK_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "HALYK_CLIENT_SECRET": "<YOUR_CLIENT_SECRET>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HALYK_TERMINAL_ID` | Yes | Terminal ID from Halyk ePay portal |
| `HALYK_CLIENT_ID` | Yes | OAuth2 client ID |
| `HALYK_CLIENT_SECRET` | Yes | OAuth2 client secret |

## Demo Prompts

- "Create a payment for 10000 KZT for order #456"
- "Check payment status for order ORD-456"
- "Generate a QR code payment for 5000 KZT"
- "Set up a monthly recurring payment of 15000 KZT"
- "Refund order ORD-456 for 5000 KZT"

## License

MIT
