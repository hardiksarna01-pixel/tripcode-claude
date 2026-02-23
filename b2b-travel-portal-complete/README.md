# B2B/B2C Travel Portal - Complete Solution

A comprehensive travel booking platform with B2B (Agent), B2C (Customer), and Whitelabel capabilities.

## Features

### Products
- **Flights** - Multi-supplier flight search and booking (Amadeus, TBO, Tripjack)
- **Hotels** - Hotel search with room selection (Hotelbeds, TBO)
- **Bus** - Bus ticket booking (RedBus, AbhiBus)
- **Holidays** - Holiday packages with customization
- **Activities** - Tours and experiences
- **Insurance** - Travel insurance
- **Visa** - Visa services
- **Transfers** - Airport transfers

### User Types
- **B2B (Agents)** - Agents with wallet, credit, commission
- **B2C (Customers)** - End customers with direct booking
- **Whitelabel** - Custom branded portals

### Admin Features
- **Dashboard** - Real-time analytics and metrics
- **Agent Management** - Groups, schemes, approval workflow
- **Supplier Management** - Multi-supplier configuration
- **Global Markup** - Flexible markup rules
- **Finance** - Invoicing, ledger, GST/TDS
- **Reports** - Comprehensive reporting
- **Whitelabel Settings** - Branding, theme, custom domain
- **Email/SMS/WhatsApp Templates** - Template management
- **API Keys** - External API integration

### AI Features
- **AI Chatbot** - Travel assistance
- **Trip Planner** - AI-powered itinerary generation
- **Price Prediction** - Best time to book
- **Smart Search** - Natural language search

### Payment Gateways
- Razorpay
- PayU
- Stripe

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL
- Redis
- JWT Authentication

### Frontend
- React 18
- Redux Toolkit
- React Router
- Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Backend Setup

```bash
cd backend
cp .env.example .env
# Configure your environment variables
npm install
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Project Structure

```
b2b-travel-portal-complete/
├── backend/
│   └── src/
│       ├── config/           # Configuration
│       ├── controllers/      # Request handlers
│       ├── middleware/       # Auth, validation, permissions
│       ├── models/           # Database schema
│       ├── routes/           # API routes
│       │   ├── admin/        # Admin routes
│       │   └── ...           # Product routes
│       └── services/         # Business logic
│           ├── flight/       # Flight API integrations
│           ├── hotel/        # Hotel API integrations
│           ├── payment/      # Payment gateways
│           ├── notification/ # Email/SMS/WhatsApp
│           └── ai/           # AI features
│
├── frontend/
│   └── src/
│       ├── components/       # React components
│       │   ├── layout/       # Layout components
│       │   ├── common/       # Shared components
│       │   └── ...           # Feature components
│       ├── contexts/         # React contexts
│       ├── pages/            # Page components
│       ├── services/         # API services
│       └── store/            # Redux store
│           └── slices/       # Redux slices
│
└── README.md
```

## API Documentation

API documentation available at `/api/v1/docs`

### Main Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/auth/*` | Authentication |
| `/api/v1/flights/*` | Flight search & booking |
| `/api/v1/hotels/*` | Hotel search & booking |
| `/api/v1/bus/*` | Bus booking |
| `/api/v1/holidays/*` | Holiday packages |
| `/api/v1/bookings/*` | Booking management |
| `/api/v1/wallet/*` | Agent wallet |
| `/api/v1/payments/*` | Payment processing |
| `/api/v1/ai/*` | AI features |
| `/api/v1/admin/*` | Admin panel |
| `/api/v1/superadmin/*` | Super admin |

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Docker

```bash
docker-compose up -d
```

### Manual

1. Set up PostgreSQL and Redis
2. Configure environment variables
3. Run database migrations
4. Build frontend
5. Start backend server

## License

MIT License
