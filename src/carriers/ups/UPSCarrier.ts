import { Carrier } from "../Carrier";
import { RateRequest } from "../../domain/RateRequest";
import { RateQuote } from "../../domain/RateQuote";
import { HttpClient } from "../../http/HttpClient";
import { UPSAuth } from "./UPSAuth";
import { mapRateRequestToUPS, mapUPSResponseToRates } from "./UPSMapper";
import { config } from "../../config";
import { CarrierError } from "../../errors/CarrierErrors";


export class UPSCarrier implements Carrier {
  private auth: UPSAuth;

  constructor(private http: HttpClient) {
    this.auth = new UPSAuth(http);
  }

  async getRates(request: RateRequest): Promise<RateQuote[]> {
  try {
    const token = await this.auth.getAccessToken();

    const upsPayload = mapRateRequestToUPS(request);

    const response = await this.http.post(
      config.ups.rateUrl,
      upsPayload,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    return mapUPSResponseToRates(response);
  } catch (error) {
    if (error instanceof CarrierError) {
      throw error;
    }

    return Promise.reject(
      new CarrierError(
        "MALFORMED_RESPONSE",
        "UPS",
        "Invalid response received from carrier",
        false
      )
    );
  }
}

}
