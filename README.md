# Falkin Prototype

A lightweight payment-risk checker built with React and a small Node.js API. It helps users evaluate a payment request by reviewing the message, website, amount, recipient status, and channel before sending money.

## What was added

- A form for entering payment details and suspicious message content
- Frontend analysis results with risk score, risk level, detected risks, and action guidance
- Severity-based intervention messaging for low, medium, high, and critical risk states
- A verification flow for stronger warnings so users must acknowledge risky scenarios before continuing
- A clean, styled result panel and action buttons for better usability

## Recent updates

This project now includes a clearer risk-analysis flow and stronger visual cues for intervention states. The UI is designed to help users understand whether a payment request looks risky and what they should do next.

## How it works

1. The user enters the payment request details in the form.
2. The frontend sends the data to the backend analysis API.
3. The API evaluates the message, website, amount, and context.
4. The UI displays a score, reasons, recommended action, and an intervention message.

## Verification

The project was checked with a production build:

- `npm run build` ✅

## Run locally

```bash
npm install
npm run dev
```

Then start the API server in the `server` folder:

```bash
cd server
node server.js
```

## Notes

The project is intentionally focused on demonstrating a practical scam-risk warning flow and clear intervention messaging for suspicious payments.
