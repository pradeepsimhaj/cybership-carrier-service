export type CarrierErrorType =
  | "AUTH_ERROR"
  | "RATE_LIMITED"
  | "BAD_REQUEST"
  | "NETWORK_ERROR"
  | "UPSTREAM_ERROR"
  | "MALFORMED_RESPONSE";

export class CarrierError extends Error {
  constructor(
    public readonly type: CarrierErrorType,
    public readonly carrier: string,
    message: string,
    public readonly retryable: boolean,
    public readonly statusCode?: number
  ) {
    super(message);
  }
}
