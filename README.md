# Logistics Website with Automated Solutions

A modern logistics and freight management web application integrated with intelligent automation tools. This project features an interactive AI chatbot for shipment tracking, a dynamic spot quote calculator driven by structured pricing data, and automated RFQ/RFP form submissions.

## 🚀 Key Features

### 🤖 1. AI-Powered Shipment Tracking
Built a conversational shipment tracking experience using **Amazon Lex V2**, backed by a Lambda function that resolves tracking IDs against a live data store for real-time status, origin, and destination lookups. Requests outside the bot's defined intents are handled by a **Gemini-powered fallback**, which keeps responses on-topic and redirects users back to logistics-related queries — eliminating dead-end "I didn't understand that" experiences and reducing support ticket volume.

**Highlights:**
- **Intent-driven NLU** — Lex V2 parses natural-language shipment queries and extracts tracking IDs via slot filling, no rigid command syntax required
- **Serverless resolution layer** — AWS Lambda handles intent routing, data lookup, and response formatting with sub-second latency
- **LLM fallback handling** — Out-of-scope or ambiguous requests are routed to the Gemini API with a scoped system prompt, keeping the assistant's persona consistent and on-brand
- **Secure credential management** — API keys and tokens retrieved at runtime via AWS Systems Manager Parameter Store (SecureString), with in-memory caching to minimize cold-start overhead
- **Graceful degradation** — Structured error handling ensures the bot never surfaces raw errors to the user, always returning a conversational response

### 📊 2. Dynamic Spot Quote Calculator
A fully functional **Spot Quote Calculator** that lets users instantly estimate freight and shipping costs. 
* It automatically reads and processes structured rates.
* Driven by a background data pipeline (`Rates.csv` derived from `Rates.xlsx`) to handle varying rates seamlessly based on weight, dimensions, and destinations.

### 📝 3. Automated RFQ/RFP Forms
Integrated with **Formspree** to manage structured Requests for Quotes (RFQ) and Requests for Proposals (RFP). 
* Streamlines user submissions for custom bulk pricing.
* Automatically captures data fields like name, email, company, and project requirements, routing them instantly to the logistics team's dashboard.

---

## 🛠️ Tech Stack & Integrations

* **Frontend:** HTML5, CSS3, JavaScript (Responsive layout)
* **AI & Conversational AI:** Amazon Lex V2 (Shipment tracking bot)
* **Forms & Backend Automation:** Formspree API
* **Data Management:** CSV / Excel (`Rates.xlsx` converted to `Rates.csv`) for dynamic pricing data

---

## 📸 Screenshots

### Shipment Tracking via LexV2 Bot
![Shipment Tracking](https://github.com/user-attachments/assets/0fbaefc1-902d-46c1-936c-8a912222db5e)

## Gemini powered out-of-scope requests handling

<img width="429" height="633" alt="Screenshot 2026-07-09 at 6 10 54 PM" src="https://github.com/user-attachments/assets/50cbc0ab-39e8-42a6-9fdd-4f4abb8ef62f" />
<img width="429" height="633" alt="Screenshot 2026-07-09 at 6 10 32 PM" src="https://github.com/user-attachments/assets/65d3cd2a-06d8-4b3d-8ab7-fedfa5957546" />


### Spot Quote Calculator
![Spot Quote Calculator](https://github.com/user-attachments/assets/148b1fe4-31b5-4120-b170-5e40e3cb1fb8)

### Data-Driven Rates Configuration
![Rates Configuration](https://github.com/user-attachments/assets/f9c999ec-a5ca-4189-ac68-142281d01243)

### Formspree RFQ/RFP Integration
![Formspree UI](https://github.com/user-attachments/assets/5037876d-61fa-412a-81d6-a845b6be5397)
![Formspree Dashboard](https://github.com/user-attachments/assets/edfd1543-403b-45c3-9515-79e0f2a3538f)

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/iamrishabhverma/logistics-website.git](https://github.com/iamrishabhverma/logistics-website.git)
   cd logistics-website
