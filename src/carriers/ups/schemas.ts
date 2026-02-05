import { z } from "zod";

/**
 * UPS OAuth token response
 */
export const UPSTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number()
});

/**
 * UPS Rate API response (simplified but realistic)
 */
export const UPSRateResponseSchema = z.object({
  RateResponse: z.object({
    RatedShipment: z.array(
      z.object({
        Service: z.object({
          Code: z.string(),
          Description: z.string().optional()
        }),
        TotalCharges: z.object({
          MonetaryValue: z.string(),
          CurrencyCode: z.string()
        }),
        GuaranteedDelivery: z
          .object({
            BusinessDaysInTransit: z.string().optional()
          })
          .optional()
      })
    )
  })
});
