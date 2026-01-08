# B2B Travel Portal - Flight Booking System

A complete B2B travel portal solution built by reverse-engineering the **Flyshop.in** platform and **Client 2.0 Air API**.

## 🚀 Features

### Backend (Node.js/Express)
- Complete API wrapper for Client 2.0 Air flight API
- JWT-based authentication for agents
- Flight search, reprice, and booking flow
- Ancillary services (SSR) - meals, baggage, seats
- Wallet management and payment processing
- Booking history and management
- Commission calculation engine
- Request validation with Joi
- Error handling middleware

### Frontend (React)
- Flight search with filters
- Booking flow UI (matching Flyshop design)
- Fare summary with commission breakdown
- Passenger details form
- SSR selection interface
- Responsive design with Tailwind CSS

## 📁 Project Structure

```
b2b-travel-portal/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── flight.controller.js
│   │   │   └── booking.controller.js
│   │   ├── services/
│   │   │   └── flight-api.service.js    # Main API wrapper
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── flight.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── wallet.routes.js
│   │   │   └── agent.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── utils/
│   │   │   ├── catchAsync.js
│   │   │   └── staticData.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlightSearchPage.jsx
│   │   │   └── FlightBookingPage.jsx
│   │   └── ...
│   └── package.json
│
└── README.md
```

## 🔧 Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🔑 API Endpoints

### Authentication
```
POST /api/v1/auth/register    - Register new agent
POST /api/v1/auth/login       - Agent login
GET  /api/v1/auth/me          - Get current agent
```

### Flights
```
GET  /api/v1/flights/sectors  - Get available sectors (cache this!)
POST /api/v1/flights/search   - Search flights
POST /api/v1/flights/reprice  - Validate & lock fare
POST /api/v1/flights/ssr      - Get ancillary services
POST /api/v1/flights/seatmap  - Get seat map
GET  /api/v1/flights/airlines - List of airlines
GET  /api/v1/flights/airports - List of airports
```

### Bookings
```
POST /api/v1/bookings/create  - Create booking (temp)
POST /api/v1/bookings/confirm - Pay & issue ticket
GET  /api/v1/bookings/:refNo  - Get booking details
GET  /api/v1/bookings         - Booking history
POST /api/v1/bookings/:refNo/cancel  - Cancel booking
POST /api/v1/bookings/:refNo/release - Release blocked PNR
```

### Wallet
```
GET /api/v1/wallet/balance    - Get wallet balance
```

## 📊 Booking Flow

```
1. Air_SectorAvailabilityPI  →  Cache available sectors
         ↓
2. Air_Search                →  Search flights
         ↓
3. Air_Reprice               →  Validate fare
         ↓
4. Air_GetSSR (optional)     →  Get meals/baggage options
         ↓
5. Air_TempBooking           →  Create PNR
         ↓
6. AddPayment                →  Debit wallet
         ↓
7. Air_Ticketing             →  Issue ticket
         ↓
8. Air_Reprint               →  Get full details
```

## 🔐 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key

# Flight API
FLIGHT_API_BASE_URL=http://domain/airlinehost/AirAPIService.svc/JSONService
TRADE_API_BASE_URL=http://domain/tradehost/TradeAPIService.svc/JSONService

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📝 API Request Examples

### Search Flights
```json
POST /api/v1/flights/search
{
  "origin": "DEL",
  "destination": "BOM",
  "travelDate": "2025-01-15",
  "adults": 1,
  "children": 0,
  "infants": 0,
  "classOfTravel": 0,
  "tripType": 0
}
```

### Create Booking
```json
POST /api/v1/bookings/create
{
  "searchKey": "from_search_response",
  "flightKey": "from_reprice_response",
  "passengers": [
    {
      "type": 0,
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "M"
    }
  ],
  "contact": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com"
  }
}
```

## 🏗️ To Build Production Version

1. **Add Database** (PostgreSQL recommended)
   - Use the schema provided in `b2b_travel_complete_analysis.md`
   - Replace mock stores with database queries

2. **Add Redis Caching**
   - Cache sector availability (3-4x daily)
   - Cache search results (5-10 min TTL)
   - Session management

3. **Add Real GDS Integration**
   - Get IATA accreditation
   - Contact Amadeus/Sabre/Travelport
   - Or use direct airline APIs

4. **Security Enhancements**
   - Rate limiting
   - Request signing
   - IP whitelisting
   - Audit logging

5. **Monitoring**
   - Add APM (DataDog, New Relic)
   - Error tracking (Sentry)
   - Logging (ELK stack)

## 📚 Based On

- **Flyshop.in** - UI/UX reference
- **Client 2.0 Air API** - Backend integration
- Original Postman collection analyzed

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
