# Cybership – Carrier Integration Service (UPS)

This project is a backend carrier integration service written in **TypeScript**. It demonstrates how to integrate with the **UPS Rating API** in a clean, maintainable, and extensible way, similar to how a real production service would be built.

The focus of this assignment is not on making live API calls, but on showing good architecture, typing, validation, error handling, and testing practices.

---

## What this service does

* Accepts a normalized rate request (origin, destination, package details)
* Converts that request into a UPS-specific payload internally
* Handles UPS OAuth 2.0 client-credentials authentication
* Parses and normalizes UPS rate responses
* Returns clean, carrier-agnostic rate quotes
* Handles realistic error scenarios (auth failures, rate limits, network errors, malformed responses)
* Verifies behavior using integration tests with stubbed HTTP responses

The caller never needs to know anything about UPS request or response formats.

---

## Project structure

```
src/
  domain/        # Carrier-agnostic domain models
  carriers/      # Carrier interfaces and UPS implementation
  http/          # HTTP client abstraction
  config/        # Environment-based configuration
  errors/        # Structured error definitions

tests/
  ups.integration.test.ts
```

All UPS-specific logic is isolated under `src/carriers/ups`. This makes it easy to add additional carriers (FedEx, DHL, USPS) without modifying existing code.

---

## Configuration

All configuration values are loaded from environment variables. No secrets are hardcoded.

Create a local `.env` file (do not commit it):

```
UPS_CLIENT_ID=dummy
UPS_CLIENT_SECRET=dummy
UPS_OAUTH_URL=https://onlinetools.ups.com/security/v1/oauth/token
UPS_RATE_URL=https://onlinetools.ups.com/api/rating/v1/Shop
```

A `.env.example` file is included to document required variables.

---

## Running the project

Install dependencies:

```
npm install
```

Run the service:

```
npm run dev
```

Expected output:

```
Cybership Carrier Integration Service loaded
Run tests to verify carrier behavior
```

The entry point does not make real API calls. All integration behavior is verified through tests.

---

## Running tests

```
npm test
```

The integration tests:

* Stub the HTTP layer (no real UPS calls)
* Simulate OAuth token acquisition and reuse
* Verify request mapping and response normalization
* Validate structured error handling for different failure scenarios

These tests exercise the service end-to-end while remaining fully deterministic.

---

## Error handling

All external failures are converted into structured errors that include:

* Error type (e.g. AUTH_ERROR, RATE_LIMITED)
* Carrier name
* Whether the error is retryable
* Optional HTTP status code

This makes it easy for callers to understand what went wrong and how to respond.

---

## Extending the service

### Adding a new carrier

To add a new carrier:

1. Create a new folder under `src/carriers/` (for example `fedex/`)
2. Implement the `Carrier` interface
3. Add carrier-specific authentication and request/response mapping

No changes to the existing UPS implementation are required.

### Adding new operations

The same structure can be used to add additional operations such as:

* Label purchase
* Shipment tracking
* Address validation

Each operation can follow the same pattern used for rate shopping.

---

## What I would improve with more time

* Persist OAuth tokens in a shared cache for multi-instance deployments
* Add retry and backoff logic for transient errors
* Add request/response logging with correlation IDs
* Expand schema validation for additional UPS response fields
* Add carrier selection and routing logic

---

## Notes

* This is a backend service only (no UI)
* No real UPS credentials are required
* All external behavior is verified through integration tests

---

## Summary

This project demonstrates a clean and extensible approach to building a carrier integration service. The emphasis is on correctness, maintainability, and testability rather than on making live API calls.
