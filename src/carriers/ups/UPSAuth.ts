import { HttpClient } from "../../http/HttpClient";
import { config } from "../../config";

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export class UPSAuth {
  private token?: string;
  private expiresAt?: number;

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string> {
    if (this.token && this.expiresAt && Date.now() < this.expiresAt) {
      return this.token;
    }

    const authHeader = Buffer.from(
      `${config.ups.clientId}:${config.ups.clientSecret}`
    ).toString("base64");

    const response = await this.http.post<TokenResponse>(
      config.ups.oauthUrl,
      "grant_type=client_credentials",
      {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    );

    this.token = response.access_token;
    this.expiresAt = Date.now() + response.expires_in * 1000;

    return this.token;
  }
}
