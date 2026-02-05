import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { CarrierError } from "../errors/CarrierErrors";

export class HttpClient {
  private client: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create(config);
  }

  async post<T>(
    url: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.mapAxiosError(error);
      }
      throw error;
    }
  }

  private mapAxiosError(error: AxiosError): CarrierError {
    if (!error.response) {
      return new CarrierError(
        "NETWORK_ERROR",
        "UPS",
        "Network error while contacting carrier",
        true
      );
    }

    const status = error.response.status;

    if (status === 401 || status === 403) {
      return new CarrierError(
        "AUTH_ERROR",
        "UPS",
        "Authentication with carrier failed",
        false,
        status
      );
    }

    if (status === 429) {
      return new CarrierError(
        "RATE_LIMITED",
        "UPS",
        "Carrier rate limit exceeded",
        true,
        status
      );
    }

    if (status >= 400 && status < 500) {
      return new CarrierError(
        "BAD_REQUEST",
        "UPS",
        "Invalid request sent to carrier",
        false,
        status
      );
    }

    return new CarrierError(
      "UPSTREAM_ERROR",
      "UPS",
      "Carrier service unavailable",
      true,
      status
    );
  }
}
