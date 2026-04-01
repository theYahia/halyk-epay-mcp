const BASE_URL = "https://epay-api.halykbank.kz/api";
const AUTH_URL = "https://epay-oauth.halykbank.kz/oauth2/token";
const TIMEOUT = 15_000;

export class HalykClient {
  private terminalId: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry = 0;

  constructor() {
    this.terminalId = process.env.HALYK_TERMINAL_ID ?? "";
    this.clientId = process.env.HALYK_CLIENT_ID ?? "";
    this.clientSecret = process.env.HALYK_CLIENT_SECRET ?? "";
    if (!this.terminalId || !this.clientId || !this.clientSecret) {
      throw new Error(
        "Environment variables HALYK_TERMINAL_ID, HALYK_CLIENT_ID, and HALYK_CLIENT_SECRET are required. " +
        "Get credentials from Halyk Bank ePay merchant portal."
      );
    }
  }

  async getToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: "webapi usermanagement email_send verification statement statistics payment",
        terminal: this.terminalId,
      });

      const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Halyk auth error ${response.status}: ${text}`);
      }

      const data = (await response.json()) as { access_token: string; expires_in: number };
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      return this.accessToken;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Halyk: auth timeout (15s). Try again later.");
      }
      throw error;
    }
  }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const token = await this.getToken();
    const url = `${BASE_URL}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Halyk HTTP ${response.status}: ${text}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return response.json();
      }
      return { status: response.status, message: await response.text() };
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Halyk: request timeout (15s). Try again later.");
      }
      throw error;
    }
  }

  async get(path: string): Promise<unknown> {
    return this.request("GET", path);
  }

  async post(path: string, body: unknown): Promise<unknown> {
    return this.request("POST", path, body);
  }

  getTerminalId(): string {
    return this.terminalId;
  }
}
