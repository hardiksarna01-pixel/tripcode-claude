# Travel Portal - API Requirements & Tools Documentation

## Table of Contents
1. [Overview](#overview)
2. [API Endpoints Required](#api-endpoints-required)
3. [External APIs & Integrations](#external-apis--integrations)
4. [Development Tools](#development-tools)
5. [UI Component Library](#ui-component-library)
6. [Database Schema Requirements](#database-schema-requirements)
7. [Security Requirements](#security-requirements)
8. [Deployment Tools](#deployment-tools)

---

## Overview

This document outlines all the APIs, tools, and integrations needed to run the B2B Travel Portal with the new UI system.

### Tech Stack Summary
- **Frontend**: React 18, Tailwind CSS 3.3, Zustand
- **Backend**: Node.js, Express 4.18
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT
- **File Storage**: AWS S3 / Cloudinary
- **Email**: SendGrid / AWS SES
- **Payment**: Multiple gateways (Razorpay, Stripe, PayU, etc.)

---

## API Endpoints Required

### 1. Authentication APIs

```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh-token      - Refresh JWT token
POST   /api/auth/forgot-password    - Initiate password reset
POST   /api/auth/reset-password     - Complete password reset
POST   /api/auth/verify-email       - Email verification
GET    /api/auth/me                 - Get current user profile
PUT    /api/auth/profile            - Update user profile
PUT    /api/auth/change-password    - Change password
```

### 2. Flight APIs

```
POST   /api/flights/search          - Search flights
GET    /api/flights/:id             - Get flight details
POST   /api/flights/fare-rules      - Get fare rules
POST   /api/flights/seat-map        - Get seat map
POST   /api/flights/ssr             - Get SSR options (meals, baggage)
POST   /api/flights/price-check     - Verify current price
GET    /api/flights/fare-calendar   - Get fare calendar
```

**Request Schema - Flight Search:**
```json
{
  "tripType": "oneway|roundtrip|multicity",
  "segments": [
    {
      "origin": "DEL",
      "destination": "BOM",
      "departDate": "2024-03-15"
    }
  ],
  "passengers": {
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "cabinClass": "economy|business|first",
  "directOnly": false,
  "preferredAirlines": []
}
```

### 3. Booking APIs

```
POST   /api/bookings/create         - Create booking
POST   /api/bookings/confirm        - Confirm booking
GET    /api/bookings                - List all bookings
GET    /api/bookings/:id            - Get booking details
PUT    /api/bookings/:id/cancel     - Cancel booking
POST   /api/bookings/:id/resend     - Resend confirmation
GET    /api/bookings/:id/ticket     - Download ticket
POST   /api/bookings/bulk           - Bulk booking operations
```

**Request Schema - Create Booking:**
```json
{
  "flightId": "FL123456",
  "passengers": [
    {
      "type": "adult",
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-01-15",
      "nationality": "IN",
      "passport": {
        "number": "A12345678",
        "expiry": "2030-01-01",
        "country": "IN"
      },
      "contact": {
        "email": "john@example.com",
        "phone": "+919876543210"
      }
    }
  ],
  "ssrSelections": {
    "meals": [...],
    "baggage": [...],
    "seats": [...]
  },
  "markup": {
    "type": "fixed|percentage",
    "value": 500
  }
}
```

### 4. Wallet & Transactions APIs

```
GET    /api/wallet                  - Get wallet balance
GET    /api/wallet/transactions     - Transaction history
POST   /api/wallet/add-funds        - Add funds to wallet
POST   /api/wallet/withdraw         - Request withdrawal
GET    /api/wallet/statements       - Download statements
```

### 5. Agent/User Management APIs

```
GET    /api/agents                  - List agents (admin)
GET    /api/agents/:id              - Get agent details
POST   /api/agents                  - Create agent (admin)
PUT    /api/agents/:id              - Update agent
DELETE /api/agents/:id              - Delete agent
PUT    /api/agents/:id/status       - Change agent status
GET    /api/agents/:id/bookings     - Get agent's bookings
GET    /api/agents/:id/commission   - Get commission settings
```

### 6. Customer Management APIs

```
GET    /api/customers               - List customers
GET    /api/customers/:id           - Get customer details
POST   /api/customers               - Create customer
PUT    /api/customers/:id           - Update customer
DELETE /api/customers/:id           - Delete customer
GET    /api/customers/:id/bookings  - Get customer's bookings
```

### 7. Markup Management APIs

```
GET    /api/markups                 - List all markups
GET    /api/markups/:id             - Get markup details
POST   /api/markups                 - Create markup rule
PUT    /api/markups/:id             - Update markup
DELETE /api/markups/:id             - Delete markup
POST   /api/markups/calculate       - Calculate markup
```

**Request Schema - Create Markup:**
```json
{
  "name": "International Markup",
  "type": "fixed|percentage",
  "value": 500,
  "applyTo": "all|airline|route|class",
  "criteria": {
    "airlines": ["AI", "UK"],
    "routes": [{"origin": "DEL", "destination": "LHR"}],
    "classes": ["business"]
  },
  "perPassenger": true,
  "isActive": true
}
```

### 8. Commission APIs

```
GET    /api/commissions             - List commission rules
POST   /api/commissions             - Create commission rule
PUT    /api/commissions/:id         - Update commission
DELETE /api/commissions/:id         - Delete commission
GET    /api/commissions/earnings    - Get commission earnings
```

### 9. Invoice APIs

```
GET    /api/invoices                - List invoices
GET    /api/invoices/:id            - Get invoice details
POST   /api/invoices                - Create invoice
GET    /api/invoices/:id/pdf        - Download invoice PDF
POST   /api/invoices/:id/send       - Email invoice
```

### 10. Reports APIs

```
GET    /api/reports/sales           - Sales report
GET    /api/reports/bookings        - Booking report
GET    /api/reports/revenue         - Revenue report
GET    /api/reports/commission      - Commission report
GET    /api/reports/agents          - Agent performance report
POST   /api/reports/export          - Export report (CSV/Excel)
```

### 11. B2C/Whitelabel APIs

```
GET    /api/b2c/sites               - List B2C sites
POST   /api/b2c/sites               - Create B2C site
PUT    /api/b2c/sites/:id           - Update B2C site
DELETE /api/b2c/sites/:id           - Delete B2C site
GET    /api/b2c/sites/:id/settings  - Get site settings
PUT    /api/b2c/sites/:id/settings  - Update site settings
POST   /api/b2c/sites/:id/verify-dns - Verify DNS
GET    /api/b2c/:domain             - Get B2C site by domain
```

### 12. Settings & Configuration APIs

```
GET    /api/settings                - Get all settings
PUT    /api/settings                - Update settings
GET    /api/settings/whitelabel     - Get whitelabel settings
PUT    /api/settings/whitelabel     - Update whitelabel settings
GET    /api/settings/email-templates - Get email templates
PUT    /api/settings/email-templates/:id - Update template
```

### 13. Notification APIs

```
GET    /api/notifications           - List notifications
PUT    /api/notifications/:id/read  - Mark as read
PUT    /api/notifications/read-all  - Mark all as read
DELETE /api/notifications/:id       - Delete notification
```

### 14. File Upload APIs

```
POST   /api/uploads/image           - Upload image
POST   /api/uploads/document        - Upload document
DELETE /api/uploads/:id             - Delete file
```

---

## External APIs & Integrations

### 1. Flight GDS/Aggregator APIs

| Provider | Type | Description |
|----------|------|-------------|
| Amadeus | GDS | Global Distribution System API |
| Travelport (Galileo) | GDS | Flight booking API |
| Sabre | GDS | Flight & travel API |
| TBO | Aggregator | Indian travel API |
| Riya Travel | Aggregator | Flight consolidator |
| Paxes | Aggregator | Multi-supplier API |
| Verteil | NDC | New Distribution Capability |
| Mystifly | Aggregator | LCC aggregator |
| TripJack | Aggregator | Indian flights API |
| Farelogix | NDC | Airline NDC platform |

**Required Credentials:**
- API Key / Secret
- Agency ID
- PCC (Pseudo City Code)
- IATA Number

### 2. Payment Gateway APIs

| Provider | Use Case | Documentation |
|----------|----------|---------------|
| Razorpay | Indian payments | https://razorpay.com/docs/api |
| Stripe | International | https://stripe.com/docs/api |
| PayU | Indian payments | https://developer.payu.in |
| CCAvenue | Indian payments | https://www.ccavenue.com |
| PhonePe | UPI payments | https://developer.phonepe.com |
| Paytm | Wallet/UPI | https://developer.paytm.com |

**Required Credentials:**
- Merchant ID
- API Key / Secret
- Salt/Checksum Key
- Webhook Secret

### 3. Communication APIs

| Service | Purpose | Documentation |
|---------|---------|---------------|
| SendGrid | Email | https://docs.sendgrid.com |
| AWS SES | Email | https://docs.aws.amazon.com/ses |
| Twilio | SMS/WhatsApp | https://www.twilio.com/docs |
| MSG91 | SMS (India) | https://docs.msg91.com |
| Firebase FCM | Push notifications | https://firebase.google.com/docs/cloud-messaging |

**Required Credentials:**
- API Keys
- Sender IDs
- Template IDs (for SMS)

### 4. Storage & CDN APIs

| Service | Purpose |
|---------|---------|
| AWS S3 | File storage |
| Cloudinary | Image optimization |
| CloudFront | CDN |
| Bunny CDN | Alternative CDN |

### 5. Insurance APIs

| Provider | Type |
|----------|------|
| Digit | Travel insurance |
| ICICI Lombard | Travel insurance |
| TATA AIG | Travel insurance |
| Bharti AXA | Travel insurance |

### 6. Other Integrations

| Service | Purpose |
|---------|---------|
| Google Maps | Airport search, maps |
| OpenAI/Claude | AI itinerary builder |
| PDF.co | PDF generation |
| QRCode API | Ticket barcodes |

---

## Development Tools

### Required NPM Packages (Frontend)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "tailwindcss": "^3.3.6",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "@headlessui/react": "^1.7.17",
    "react-hot-toast": "^2.4.1",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.8.4",
    "recharts": "^2.10.3",
    "qrcode.react": "^3.1.0",
    "html2pdf.js": "^0.10.1",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.2",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.4",
    "@testing-library/react": "^14.1.0"
  }
}
```

### Required NPM Packages (Backend)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "crypto-js": "^4.2.0",
    "uuid": "^9.0.1",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "nodemailer": "^6.9.7",
    "ioredis": "^5.3.2",
    "bull": "^4.12.0",
    "node-cron": "^3.0.3"
  }
}
```

### Development Environment Tools

1. **Code Quality**
   - ESLint - JavaScript linting
   - Prettier - Code formatting
   - Husky - Git hooks
   - lint-staged - Pre-commit linting

2. **Testing**
   - Vitest / Jest - Unit testing
   - React Testing Library - Component testing
   - Playwright / Cypress - E2E testing
   - MSW - API mocking

3. **Documentation**
   - Storybook - Component documentation
   - Swagger/OpenAPI - API documentation
   - JSDoc - Code documentation

4. **Monitoring & Debugging**
   - React DevTools
   - Redux DevTools (if using Redux)
   - Network tab / Axios interceptors
   - Sentry - Error tracking

---

## UI Component Library

### Complete Component List

| Category | Components |
|----------|------------|
| **Core** | Button, IconButton, ButtonGroup, Input, SearchInput, TextArea |
| **Cards** | Card, CardHeader, CardBody, CardFooter, StatCard, FeatureCard, ImageCard |
| **Data Display** | Table, DataTable, Pagination, Badge, StatusBadge, EmptyState, Skeleton |
| **Navigation** | Breadcrumb, PageHeader, Tabs, VerticalTabs, StepTabs, Sidebar |
| **Feedback** | Toast, Alert, Banner, Callout, Tooltip, Progress, Spinner |
| **Forms** | Select, Checkbox, Radio, Switch, DatePicker, TimePicker, FileUpload |
| **Layout** | Container, Grid, Flex, Stack, Divider, Spacer, AspectRatio |
| **Overlay** | Modal, Drawer, Sheet, Dropdown, Popover, ContextMenu |

### Import Example

```jsx
import {
  Button,
  Card,
  Table,
  Modal,
  useToast,
  useDisclosure
} from '@/components/ui';
```

### Custom Hooks Available

```jsx
import {
  useDisclosure,      // Modal/drawer open state
  useDebounce,        // Debounce values
  useLocalStorage,    // Persist to localStorage
  useMediaQuery,      // Responsive breakpoints
  useClickOutside,    // Click outside detection
  usePagination,      // Pagination state
  useSelection,       // Multi-select state
  useCopyToClipboard, // Clipboard API
  useAsync            // Async operation handling
} from '@/hooks/useUI';
```

---

## Database Schema Requirements

### Core Tables

```sql
-- Users/Agents
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'agent', 'sub_agent', 'customer'),
  status ENUM('active', 'pending', 'suspended'),
  company_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  pnr VARCHAR(20) UNIQUE,
  agent_id UUID REFERENCES users(id),
  customer_id UUID REFERENCES customers(id),
  status ENUM('pending', 'confirmed', 'cancelled', 'completed'),
  flight_data JSONB,
  passengers JSONB,
  base_fare DECIMAL(12,2),
  taxes DECIMAL(12,2),
  markup DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  payment_status ENUM('pending', 'paid', 'refunded'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallet
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  balance DECIMAL(12,2) DEFAULT 0,
  credit_limit DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  type ENUM('credit', 'debit', 'refund'),
  amount DECIMAL(12,2),
  balance_after DECIMAL(12,2),
  reference_type VARCHAR(50),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Markups
CREATE TABLE markups (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  name VARCHAR(100),
  type ENUM('fixed', 'percentage'),
  value DECIMAL(10,2),
  apply_to ENUM('all', 'airline', 'route', 'class'),
  criteria JSONB,
  per_passenger BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- B2C Sites
CREATE TABLE b2c_sites (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  domain VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  settings JSONB,
  dns_verified BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT false,
  status ENUM('active', 'pending_dns', 'suspended'),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Redis Keys

```
session:{userId}           - User session data
flight:search:{hash}       - Cached search results (TTL: 15min)
flight:price:{id}          - Cached fare (TTL: 5min)
wallet:balance:{userId}    - Cached balance
rate_limit:{ip}            - Rate limiting
queue:emails              - Email queue
queue:bookings            - Booking queue
```

---

## Security Requirements

### API Security

1. **Authentication**
   - JWT tokens with short expiry (15min)
   - Refresh token rotation
   - Secure HTTP-only cookies
   - CSRF protection

2. **Authorization**
   - Role-based access control (RBAC)
   - API key authentication for B2B
   - IP whitelisting option

3. **Rate Limiting**
   - 100 requests/min for authenticated users
   - 20 requests/min for unauthenticated
   - Stricter limits for sensitive endpoints

4. **Data Security**
   - AES-256 encryption for sensitive data
   - bcrypt for password hashing
   - PCI DSS compliance for payments
   - GDPR compliance for EU users

5. **Headers**
   - Helmet.js security headers
   - CORS configuration
   - Content Security Policy
   - X-Frame-Options

### Required Environment Variables

```env
# Application
NODE_ENV=production
PORT=3001
APP_URL=https://portal.example.com

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/traveldb
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# GDS APIs
AMADEUS_API_KEY=xxx
AMADEUS_API_SECRET=xxx
TBO_USERNAME=xxx
TBO_PASSWORD=xxx

# Payment
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
STRIPE_SECRET_KEY=xxx

# Email
SENDGRID_API_KEY=xxx
EMAIL_FROM=noreply@example.com

# SMS
TWILIO_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE=xxx

# Storage
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=xxx
AWS_REGION=ap-south-1

# Encryption
ENCRYPTION_KEY=32-char-encryption-key-here

# Monitoring
SENTRY_DSN=xxx
```

---

## Deployment Tools

### Infrastructure

1. **Cloud Providers**
   - AWS (EC2, RDS, ElastiCache, S3)
   - Google Cloud Platform
   - DigitalOcean

2. **Containerization**
   - Docker
   - Docker Compose
   - Kubernetes (for scale)

3. **CI/CD**
   - GitHub Actions
   - GitLab CI
   - Jenkins

4. **Monitoring**
   - Sentry (Error tracking)
   - DataDog / New Relic (APM)
   - CloudWatch (AWS logs)
   - Grafana + Prometheus (metrics)

### Docker Compose Example

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:3001

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/traveldb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=traveldb

  redis:
    image: redis:7
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## Summary

This document provides a comprehensive overview of all APIs, tools, and integrations required for the Travel Portal. The new UI component library provides 50+ reusable components with consistent styling and behavior.

### Quick Links

- Frontend Components: `frontend/src/components/ui/`
- Custom Hooks: `frontend/src/hooks/useUI.js`
- Theme Configuration: `frontend/src/styles/theme.js`
- Backend Routes: `backend/src/routes/`
- Controllers: `backend/src/controllers/`

### Next Steps

1. Set up development environment with required dependencies
2. Configure environment variables
3. Connect to GDS/aggregator APIs
4. Implement payment gateway integration
5. Set up email/SMS services
6. Deploy to staging environment
7. Conduct security audit
8. Launch production deployment
