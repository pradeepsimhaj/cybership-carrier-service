import { RateRequest } from "../domain/RateRequest";
import { RateQuote } from "../domain/RateQuote";

export interface Carrier {
  getRates(request: RateRequest): Promise<RateQuote[]>;
}
