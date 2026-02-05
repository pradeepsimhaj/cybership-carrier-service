import { RateRequest } from "../../domain/RateRequest";

type UPSRateRequestPayload = {
  RateRequest: {
    Shipment: unknown;
  };
};

export function mapRateRequestToUPS(request: RateRequest): any {
  return {
    RateRequest: {
      Shipment: {
        Shipper: {
          Address: {
            PostalCode: request.origin.postalCode,
            CountryCode: request.origin.countryCode
          }
        },
        ShipTo: {
          Address: {
            PostalCode: request.destination.postalCode,
            CountryCode: request.destination.countryCode
          }
        },
        Package: request.packages.map(pkg => ({
          PackagingType: { Code: "02" },
          Dimensions: {
            UnitOfMeasurement: { Code: "CM" },
            Length: pkg.lengthCm.toString(),
            Width: pkg.widthCm.toString(),
            Height: pkg.heightCm.toString()
          },
          PackageWeight: {
            UnitOfMeasurement: { Code: "KGS" },
            Weight: pkg.weightKg.toString()
          }
        }))
      }
    }
  };
}



import { RateQuote } from "../../domain/RateQuote";
import { UPSRateResponseSchema } from "./schemas";

export function mapUPSResponseToRates(data: unknown): RateQuote[] {
  const parsed = UPSRateResponseSchema.parse(data);

  return parsed.RateResponse.RatedShipment.map(shipment => ({
    carrier: "UPS",
    service: shipment.Service.Description ?? shipment.Service.Code,
    amount: Number(shipment.TotalCharges.MonetaryValue),
    currency: shipment.TotalCharges.CurrencyCode,
    estimatedDeliveryDays: shipment.GuaranteedDelivery?.BusinessDaysInTransit
      ? Number(shipment.GuaranteedDelivery.BusinessDaysInTransit)
      : undefined
  }));
}
