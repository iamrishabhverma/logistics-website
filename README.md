# Logistics Website with Automated Solutions

A modern logistics and freight management web application integrated with intelligent automation tools. This project features an interactive AI chatbot for shipment tracking, a dynamic spot quote calculator driven by structured pricing data, and automated RFQ/RFP form submissions.

## 🚀 Key Features

### 🤖 1. AI-Powered Shipment Tracking
Integrated with an **Amazon Lex V2 chatbot** to provide real-time automated updates on shipment status. Customers can naturally converse with the bot to track their orders, reducing support ticket volume and improving the user experience.

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
