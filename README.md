# QR Donation – Charity & Event API

This repository contains the backend API implementation for the **Charity** and **Event** modules of the QR Code-Based Donation System. It supports core functionality such as creating charities, managing campaigns, generating QR-linked events, and fetching event data for donors and admin apps.

## 🔧 Tech Stack

- **Backend Framework**: Fastify (Node.js)
- **Database**: MongoDB (with Compass for validation)
- **Testing Tools**: Postman, Android APK, Fastify dev logs

## 📌 Features

### Charity Module
- `GET /api/charity/{charityId}` – Fetch single charity profile
- `GET /api/charity/list` – Return all active charities
- `POST /api/charity` – Create a new charity with validation and auth

### Event Module
- `POST /api/event` – Create donation events linked to charities
- `GET /api/event/list` – List all upcoming or current events
- `GET /api/event/{eventId}` – Fetch a single campaign for display

## 🧪 Testing Approach

All endpoints were tested using:
- ✅ **Postman** – To simulate valid/invalid payloads and token protection
- ✅ **Android App** – Verified correct display and linkage of charity/event data
- ✅ **MongoDB Compass** – For real-time validation of data structure and storage

## 🔐 Security

- JWT-protected routes for sensitive operations
- Validation for date logic, missing fields, and auth headers

## 📂 Contribution Note

This module was authored as part of the backend team for the COS80029 Technology Application Project at Swinburne University. It specifically reflects testing and development work for Charity and Event workflows.

