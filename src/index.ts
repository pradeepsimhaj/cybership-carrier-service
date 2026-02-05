// import { UPSCarrier } from "./carriers/ups/UPSCarrier";
// import { HttpClient } from "./http/HttpClient";
// import { RateRequestSchema } from "./domain/RateRequest";

// const http = new HttpClient();
// const ups = new UPSCarrier(http);

// const request = RateRequestSchema.parse({
//   origin: { postalCode: "10001", countryCode: "US" },
//   destination: { postalCode: "90001", countryCode: "US" },
//   packages: [{ weightKg: 2, lengthCm: 10, widthCm: 10, heightCm: 10 }]
// });

// ups.getRates(request).then(() => {
//   console.log("UPS carrier wired successfully");
// });


console.log("Cybership Carrier Integration Service loaded");
console.log("Run tests to verify carrier behavior");
