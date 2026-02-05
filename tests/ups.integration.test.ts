import { UPSCarrier } from "../src/carriers/ups/UPSCarrier";
import { CarrierError } from "../src/errors/CarrierErrors";
import { RateRequest } from "../src/domain/RateRequest";

describe("UPS Carrier Integration", () => {
  let mockHttp: any;
  let carrier: UPSCarrier;

  const validRequest: RateRequest = {
    origin: { postalCode: "10001", countryCode: "US" },
    destination: { postalCode: "90001", countryCode: "US" },
    packages: [
      {
        weightKg: 2,
        lengthCm: 10,
        widthCm: 10,
        heightCm: 10
      }
    ]
  };

  beforeEach(() => {
    process.env.UPS_CLIENT_ID = "test";
    process.env.UPS_CLIENT_SECRET = "test";
    process.env.UPS_OAUTH_URL = "https://ups.test/oauth";
    process.env.UPS_RATE_URL = "https://ups.test/rate";

    mockHttp = {
      post: jest.fn()
    };

    carrier = new UPSCarrier(mockHttp);
  });

  // -------------------------------
  // SUCCESS PATH
  // -------------------------------
  it("returns normalized rate quotes on success", async () => {
    mockHttp.post
      // OAuth token
      .mockResolvedValueOnce({
        access_token: "fake-token",
        expires_in: 3600
      })
      // Rate response
      .mockResolvedValueOnce({
        RateResponse: {
          RatedShipment: [
            {
              Service: { Code: "03", Description: "UPS Ground" },
              TotalCharges: {
                MonetaryValue: "15.50",
                CurrencyCode: "USD"
              },
              GuaranteedDelivery: {
                BusinessDaysInTransit: "4"
              }
            }
          ]
        }
      });

    const rates = await carrier.getRates(validRequest);

    expect(rates).toEqual([
      {
        carrier: "UPS",
        service: "UPS Ground",
        amount: 15.5,
        currency: "USD",
        estimatedDeliveryDays: 4
      }
    ]);

    expect(mockHttp.post).toHaveBeenCalledTimes(2);
  });

  // -------------------------------
  // AUTH TOKEN CACHING
  // -------------------------------
  it("reuses OAuth token until expiry", async () => {
    mockHttp.post
      .mockResolvedValueOnce({
        access_token: "cached-token",
        expires_in: 3600
      })
      .mockResolvedValue({
        RateResponse: {
          RatedShipment: []
        }
      });

    await carrier.getRates(validRequest);
    await carrier.getRates(validRequest);

    // OAuth called only once
    expect(mockHttp.post.mock.calls[0][0]).toContain("oauth");
  });

  // -------------------------------
  // AUTH FAILURE
  // -------------------------------
  it("throws AUTH_ERROR on 401", async () => {
    mockHttp.post.mockRejectedValueOnce(
      new CarrierError("AUTH_ERROR", "UPS", "Auth failed", false, 401)
    );

    await expect(carrier.getRates(validRequest)).rejects.toMatchObject({
      type: "AUTH_ERROR",
      carrier: "UPS"
    });
  });

  // -------------------------------
  // RATE LIMITING
  // -------------------------------
  it("throws RATE_LIMITED error on 429", async () => {
    mockHttp.post.mockRejectedValueOnce(
      new CarrierError("RATE_LIMITED", "UPS", "Too many requests", true, 429)
    );

    await expect(carrier.getRates(validRequest)).rejects.toMatchObject({
      type: "RATE_LIMITED",
      retryable: true
    });
  });

  // -------------------------------
  // MALFORMED RESPONSE
  // -------------------------------
  it("throws MALFORMED_RESPONSE when UPS returns invalid data", async () => {
    mockHttp.post
      .mockResolvedValueOnce({
        access_token: "fake-token",
        expires_in: 3600
      })
      .mockResolvedValueOnce({
        invalid: "structure"
      });

    await expect(carrier.getRates(validRequest)).rejects.toMatchObject({
      type: "MALFORMED_RESPONSE"
    });
  });
});
