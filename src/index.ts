import { RateRequestSchema } from "./domain/RateRequest";

const input = {
  origin: { postalCode: "10001", countryCode: "US" },
  destination: { postalCode: "90001", countryCode: "US" },
  packages: [
    { weightKg: 2, lengthCm: 10, widthCm: 10, heightCm: 10 }
  ]
};

RateRequestSchema.parse(input);
console.log("Validation passed");
