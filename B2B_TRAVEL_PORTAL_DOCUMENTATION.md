# B2B Travel Portal - Complete Feature Documentation

**Version:** 1.0
**Generated:** December 28, 2025
**Project:** B2B Flight Booking System (Flyshop Architecture)

---

## TABLE OF CONTENTS

1. [Repository Overview](#repository-overview)
2. [Branch Structure](#branch-structure)
3. [Agent Panel Features](#agent-panel-features)
4. [Admin Panel Features](#admin-panel-features)
5. [Super Admin Panel Features](#super-admin-panel-features)
6. [Database Schema Overview](#database-schema-overview)
7. [API Endpoints Summary](#api-endpoints-summary)
8. [Menu Structure](#menu-structure)

---

## REPOSITORY OVERVIEW

### Git Branches

| Branch Name | Description | Status |
|-------------|-------------|--------|
| `claude/review-conversation-history-SNfDO` | Current working branch | Active |
| `claude/expose-localhost-localtunnel-CcRPB` | Extracted codebase with full implementation | Active |

### Commits History

| Commit | Description |
|--------|-------------|
| `8412be1` | Extract b2b-travel-portal from zip archive - Full codebase with backend, frontend, and admin panels |
| `6b11f9f` | Add files via upload - Initial zip file |

### Project Structure

```
b2b-travel-portal/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── flight.controller.js
│   │   │   └── booking.controller.js
│   │   ├── services/
│   │   │   ├── flight-api.service.js
│   │   │   ├── notification.service.js
│   │   │   └── pdf.service.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── flight.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── wallet.routes.js
│   │   │   ├── agent.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin-auth.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   └── schema.sql
│   │   └── utils/
│   │       ├── catchAsync.js
│   │       └── staticData.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   └── components/
    │       ├── FlightSearchPage.jsx
    │       ├── FlightBookingPage.jsx
    │       └── admin/
    │           ├── AgentSignupApprovals.jsx
    │           ├── SchemeManagement.jsx
    │           └── ApiProviderManagement.jsx
    └── package.json
```

---

## BRANCH STRUCTURE

```
main
 │
 ├── claude/expose-localhost-localtunnel-CcRPB
 │   └── Full extracted codebase
 │
 └── claude/review-conversation-history-SNfDO (Current)
     └── Documentation and analysis
```

---

## AGENT PANEL FEATURES

### 1. Authentication & Registration

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Agent Registration | `POST /api/v1/auth/register` | Self-registration with company details |
| Agent Login | `POST /api/v1/auth/login` | JWT-based authentication |
| Get Current User | `GET /api/v1/auth/me` | Retrieve logged-in agent info |

### 2. Profile Management

| Feature | Endpoint | Description |
|---------|----------|-------------|
| View Profile | `GET /api/v1/agents/profile` | View agent profile details |
| Update Profile | `PUT /api/v1/agents/profile` | Update company name, mobile, etc. |

### 3. Dashboard

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Dashboard Stats | `GET /api/v1/agents/dashboard` | View today's bookings, revenue, pending bookings |

### 4. Flight Search & Booking

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Get Sectors | `GET /api/v1/flights/sectors` | Available routes and dates |
| Search Flights | `POST /api/v1/flights/search` | Search by origin, destination, date |
| Reprice Flights | `POST /api/v1/flights/reprice` | Validate and lock fare |
| Get SSR | `POST /api/v1/flights/ssr` | Ancillary services (meals, baggage) |
| Get Seat Map | `POST /api/v1/flights/seatmap` | Seat selection interface |
| Get Airlines | `GET /api/v1/flights/airlines` | List of supported airlines |
| Get Airports | `GET /api/v1/flights/airports` | Airport directory |

### 5. Booking Management

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Create Booking | `POST /api/v1/bookings/create` | Create temp booking (PNR) |
| Confirm Booking | `POST /api/v1/bookings/confirm` | Pay and issue ticket |
| View Booking | `GET /api/v1/bookings/:refNo` | Get booking details |
| Booking History | `GET /api/v1/bookings` | List all bookings |
| Cancel Booking | `POST /api/v1/bookings/:refNo/cancel` | Cancel a booking |
| Release PNR | `POST /api/v1/bookings/:refNo/release` | Release blocked PNR |
| Add SSR Post-Booking | `POST /api/v1/bookings/:refNo/ssr` | Add ancillary services after booking |

### 6. Wallet Management

| Feature | Endpoint | Description |
|---------|----------|-------------|
| View Balance | `GET /api/v1/wallet/balance` | Current wallet balance |
| Transaction History | `GET /api/v1/wallet/transactions` | Credit/debit history |

### Agent Panel Menu Structure

```
AGENT DASHBOARD
├── Dashboard
│   ├── Today's Bookings
│   ├── Month Bookings
│   ├── Total Revenue
│   └── Pending Bookings
│
├── Flight Booking
│   ├── Search Flights
│   │   ├── One Way
│   │   ├── Round Trip
│   │   └── Multi-City
│   ├── Select Flights
│   ├── Choose Extras (SSR)
│   │   ├── Meals
│   │   ├── Baggage
│   │   └── Seat Selection
│   └── Passenger Details
│
├── My Bookings
│   ├── View All Bookings
│   ├── Filter by Status
│   │   ├── Confirmed
│   │   ├── Pending
│   │   ├── Cancelled
│   │   └── Blocked
│   └── Booking Actions
│       ├── View Details
│       ├── Download Ticket
│       ├── Cancel
│       └── Add SSR
│
├── Wallet
│   ├── Balance Overview
│   └── Transaction History
│
└── My Profile
    ├── View Profile
    ├── Update Details
    └── Change Password
```

---

## ADMIN PANEL FEATURES

### 1. Groups Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Groups | `GET /api/v1/admin/groups` | `groups.view` | List all agent groups |
| Create Group | `POST /api/v1/admin/groups` | `groups.create` | Create new group with default scheme |
| Update Group | `PUT /api/v1/admin/groups/:id` | `groups.edit` | Modify group settings |
| View Group Agents | `GET /api/v1/admin/groups/:id/agents` | `groups.view` | List agents in a group |

**Group Properties:**
- Group Name & Code
- Description
- Parent Group (hierarchical)
- Default Scheme
- Credit Limit
- Active Status

### 2. Schemes Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Schemes | `GET /api/v1/admin/schemes` | `schemes.view` | List all commission schemes |
| Create Scheme | `POST /api/v1/admin/schemes` | `schemes.create` | Create new scheme |
| Update Scheme | `PUT /api/v1/admin/schemes/:id` | `schemes.edit` | Modify scheme settings |
| Get API Config | `GET /api/v1/admin/schemes/:id/api-config` | `schemes.view` | API configurations per scheme |
| Update API Config | `PUT /api/v1/admin/schemes/:id/api-config` | `schemes.edit` | Modify API configs |
| Get Airline Rules | `GET /api/v1/admin/schemes/:id/airline-rules` | `schemes.view` | Airline-specific rules |

**Scheme Properties:**
- Scheme Name & Code
- Domestic Flight Settings:
  - Service Fee (Flat/Percentage)
  - Markup on Base Fare
  - Commission Share %
- International Flight Settings:
  - Service Fee (Flat/Percentage)
  - Markup on Base Fare
  - Commission Share %
- Tax Settings:
  - GST (Enable/Rate)
  - TDS (Enable/Rate)
- General Settings:
  - Allow Credit
  - Max Credit Limit
  - Auto Ticket
  - Block Ticket Allowed
  - Block Ticket Duration

### 3. API Providers Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Providers | `GET /api/v1/admin/api-providers` | `apis.view` | List API providers |
| Create Provider | `POST /api/v1/admin/api-providers` | `apis.create` | Add new provider |
| Update Provider | `PUT /api/v1/admin/api-providers/:id` | `apis.edit` | Modify provider settings |
| Get Airlines | `GET /api/v1/admin/api-providers/:id/airlines` | `apis.view` | Configured airlines |
| Update Airlines | `PUT /api/v1/admin/api-providers/:id/airlines` | `apis.edit` | Update airline config |
| Get Fare Commissions | `GET /api/v1/admin/api-providers/:id/fare-commissions` | `apis.view` | Commission by fare type |

**Provider Properties:**
- Provider Name & Code
- Provider Type (GDS, LCC_DIRECT, CONSOLIDATOR)
- API Credentials (URL, User ID, Password, Key)
- Contact Details (Actual)
- Masked Contact Details (for agents)
- Base Commission (Domestic/International)
- Settings (Active, Test Mode, Timeouts)

### 4. Agents Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Agents | `GET /api/v1/admin/agents` | `agents.view` | List all agents with filters |
| View Agent Details | `GET /api/v1/admin/agents/:id` | `agents.view` | Detailed agent info |
| Create Agent | `POST /api/v1/admin/agents` | `agents.create` | Admin-created agent |
| Update Agent | `PUT /api/v1/admin/agents/:id` | `agents.edit` | Modify agent details |
| Update Status | `PUT /api/v1/admin/agents/:id/status` | `agents.block` | Approve/Suspend/Block |
| Assign Group | `PUT /api/v1/admin/agents/:id/assign-group` | `agents.edit` | Change group/scheme |
| Reset Password | `POST /api/v1/admin/agents/:id/reset-password` | `agents.edit` | Send new password |

### 5. Agent Signup Approvals

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Requests | `GET /api/v1/admin/signup-requests` | `agents.approve` | Pending signups |
| Request Details | `GET /api/v1/admin/signup-requests/:id` | `agents.approve` | Full signup info |
| Mark Under Review | `PUT /api/v1/admin/signup-requests/:id/review` | `agents.approve` | Start review |
| Approve Signup | `POST /api/v1/admin/signup-requests/:id/approve` | `agents.approve` | Create agent account |
| Reject Signup | `POST /api/v1/admin/signup-requests/:id/reject` | `agents.approve` | Reject with reason |

**Approval Workflow:**
1. View pending requests
2. Review KYC documents (PAN, GST, Aadhaar)
3. Assign Group and Scheme
4. Set initial credit limit
5. Approve → Credentials sent via Email/WhatsApp

### 6. Wallet Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Agent Wallet | `GET /api/v1/admin/agents/:id/wallet` | `wallet.view` | Balance & history |
| Credit Wallet | `POST /api/v1/admin/agents/:id/wallet/credit` | `wallet.credit` | Add funds |
| Debit Wallet | `POST /api/v1/admin/agents/:id/wallet/debit` | `wallet.debit` | Manual adjustment |

### 7. Bookings Management

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View All Bookings | `GET /api/v1/admin/bookings` | `bookings.view` | Filtered booking list |
| Booking Details | `GET /api/v1/admin/bookings/:id` | `bookings.view` | Full booking info |

**Filters Available:**
- Agent ID
- Group ID
- Status
- Date Range
- PNR/Booking Reference Search

### 8. Tax Configuration

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| View Tax Config | `GET /api/v1/admin/tax-config` | `settings.view` | Tax rules |
| Create Tax Config | `POST /api/v1/admin/tax-config` | `settings.edit` | New tax rule |

### 9. Dashboard & Reports

| Feature | Endpoint | Permission | Description |
|---------|----------|------------|-------------|
| Dashboard Stats | `GET /api/v1/admin/dashboard` | - | Overview metrics |
| Booking Reports | `GET /api/v1/admin/reports/bookings` | `reports.view` | Booking analytics |
| Revenue Reports | `GET /api/v1/admin/reports/revenue` | `reports.view` | Revenue analytics |

### Admin Panel Menu Structure

```
ADMIN PANEL
├── Dashboard
│   ├── Total Agents
│   ├── Active Bookings
│   ├── Today's Revenue
│   └── Pending Approvals
│
├── Agent Management
│   ├── All Agents
│   │   ├── View/Search
│   │   ├── Filter by Group
│   │   ├── Filter by Status
│   │   └── Export
│   ├── Create Agent
│   ├── Agent Details
│   │   ├── Profile Info
│   │   ├── KYC Documents
│   │   ├── Group/Scheme Assignment
│   │   └── Wallet Details
│   └── Agent Actions
│       ├── Edit Profile
│       ├── Change Status
│       ├── Reset Password
│       └── Assign Group
│
├── Signup Approvals
│   ├── Pending Requests
│   ├── Under Review
│   ├── Approved
│   ├── Rejected
│   └── Request Actions
│       ├── View Details
│       ├── Verify KYC
│       ├── Approve (assign group/scheme)
│       └── Reject (with reason)
│
├── Groups Management
│   ├── View All Groups
│   ├── Create Group
│   ├── Edit Group
│   └── View Group Agents
│
├── Schemes Management
│   ├── View All Schemes
│   ├── Create Scheme
│   ├── Edit Scheme
│   │   ├── Domestic Settings
│   │   ├── International Settings
│   │   ├── Tax Settings
│   │   ├── API Configuration
│   │   └── General Settings
│   └── Airline-Specific Rules
│
├── API Providers
│   ├── View All Providers
│   ├── Add Provider
│   ├── Provider Details
│   │   ├── Basic Info
│   │   ├── API Credentials
│   │   ├── Airline Configuration
│   │   ├── Commission Settings
│   │   └── Contact Details
│   └── Provider Actions
│       ├── Enable/Disable
│       ├── Test Mode Toggle
│       └── Update Credentials
│
├── Bookings
│   ├── All Bookings
│   ├── Filter/Search
│   └── Booking Details
│
├── Wallet Management
│   ├── Agent Wallets
│   ├── Credit Operations
│   ├── Debit Operations
│   └── Transaction History
│
├── Tax Configuration
│   ├── View Tax Rules
│   └── Create/Edit Rules
│
└── Reports
    ├── Booking Reports
    ├── Revenue Reports
    └── Export Options
```

---

## SUPER ADMIN PANEL FEATURES

The Super Admin has ALL permissions plus additional system-level controls:

### Exclusive Super Admin Features

| Feature | Description |
|---------|-------------|
| Full Permission Access | `['*']` - All permissions granted |
| Admin User Management | Create/Edit/Delete admin users |
| Role Assignment | Assign roles to admin staff |
| Permission Management | Configure permission sets |
| System Settings | Configure global settings |
| Audit Log Access | View all system activity |

### Admin Roles Hierarchy

```
SUPER_ADMIN (Full Access)
    │
    ├── ADMIN (Extended Access)
    │   └── All features except admin management
    │
    ├── MANAGER (Limited Admin)
    │   └── Agents, Bookings, Reports
    │
    └── STAFF (Basic Access)
        └── View-only permissions
```

### Permission Categories

| Category | Permissions |
|----------|-------------|
| AGENTS | `agents.view`, `agents.create`, `agents.edit`, `agents.approve`, `agents.block` |
| GROUPS | `groups.view`, `groups.create`, `groups.edit` |
| SCHEMES | `schemes.view`, `schemes.create`, `schemes.edit` |
| APIS | `apis.view`, `apis.create`, `apis.edit` |
| BOOKINGS | `bookings.view`, `bookings.cancel` |
| WALLET | `wallet.view`, `wallet.credit`, `wallet.debit` |
| REPORTS | `reports.view`, `reports.export` |
| SETTINGS | `settings.view`, `settings.edit` |

### Super Admin Menu Structure

```
SUPER ADMIN PANEL
├── All Admin Features (see above)
│
├── Admin Users
│   ├── View All Admins
│   ├── Create Admin User
│   ├── Edit Admin
│   ├── Assign Role
│   └── Manage Permissions
│
├── System Configuration
│   ├── Global Settings
│   ├── API Defaults
│   ├── Email/SMS/WhatsApp Settings
│   └── Notification Templates
│
└── Audit Logs
    ├── View All Activity
    ├── Filter by User
    ├── Filter by Action
    └── Export Logs
```

---

## DATABASE SCHEMA OVERVIEW

### Core Tables

| Table | Purpose |
|-------|---------|
| `groups` | Agent groups with shared settings |
| `schemes` | Commission/markup rules |
| `scheme_api_config` | API settings per scheme |
| `scheme_airline_rules` | Airline-specific rules per scheme |
| `api_providers` | Flight API provider configuration |
| `api_provider_airlines` | Airlines per provider |
| `api_provider_fare_commissions` | Fare type commissions |
| `agents` | Agent accounts and profiles |
| `agent_group_history` | Group change tracking |
| `agent_signup_requests` | Self-registration queue |
| `tax_configurations` | Tax rules |
| `bookings` | Booking records |
| `booking_passengers` | Passenger details |
| `booking_segments` | Flight segments |
| `wallet_transactions` | Financial transactions |
| `notification_templates` | Message templates |
| `notification_logs` | Sent notifications |
| `admin_users` | Admin accounts |
| `admin_permissions` | Permission definitions |
| `audit_logs` | System audit trail |

---

## API ENDPOINTS SUMMARY

### Public Endpoints
```
POST /api/v1/auth/register       - Agent registration
POST /api/v1/auth/login          - Agent login
```

### Agent Endpoints (Authenticated)
```
GET  /api/v1/auth/me             - Current user
GET  /api/v1/agents/profile      - View profile
PUT  /api/v1/agents/profile      - Update profile
GET  /api/v1/agents/dashboard    - Dashboard stats

GET  /api/v1/flights/sectors     - Available sectors
POST /api/v1/flights/search      - Search flights
POST /api/v1/flights/reprice     - Validate fare
POST /api/v1/flights/ssr         - Get ancillaries
POST /api/v1/flights/seatmap     - Seat map
GET  /api/v1/flights/airlines    - Airlines list
GET  /api/v1/flights/airports    - Airports list

POST /api/v1/bookings/create     - Create booking
POST /api/v1/bookings/confirm    - Confirm & ticket
GET  /api/v1/bookings/:refNo     - Booking details
GET  /api/v1/bookings            - Booking history
POST /api/v1/bookings/:refNo/cancel  - Cancel
POST /api/v1/bookings/:refNo/release - Release PNR
POST /api/v1/bookings/:refNo/ssr     - Add SSR

GET  /api/v1/wallet/balance      - Wallet balance
GET  /api/v1/wallet/transactions - Transaction history
```

### Admin Endpoints (Admin Auth + Permissions)
```
# Groups
GET    /api/v1/admin/groups
POST   /api/v1/admin/groups
PUT    /api/v1/admin/groups/:id
GET    /api/v1/admin/groups/:id/agents

# Schemes
GET    /api/v1/admin/schemes
POST   /api/v1/admin/schemes
PUT    /api/v1/admin/schemes/:id
GET    /api/v1/admin/schemes/:id/api-config
PUT    /api/v1/admin/schemes/:id/api-config
GET    /api/v1/admin/schemes/:id/airline-rules

# API Providers
GET    /api/v1/admin/api-providers
POST   /api/v1/admin/api-providers
PUT    /api/v1/admin/api-providers/:id
GET    /api/v1/admin/api-providers/:id/airlines
PUT    /api/v1/admin/api-providers/:id/airlines
GET    /api/v1/admin/api-providers/:id/fare-commissions

# Agents
GET    /api/v1/admin/agents
GET    /api/v1/admin/agents/:id
POST   /api/v1/admin/agents
PUT    /api/v1/admin/agents/:id
PUT    /api/v1/admin/agents/:id/status
PUT    /api/v1/admin/agents/:id/assign-group
POST   /api/v1/admin/agents/:id/reset-password

# Signup Requests
GET    /api/v1/admin/signup-requests
GET    /api/v1/admin/signup-requests/:id
PUT    /api/v1/admin/signup-requests/:id/review
POST   /api/v1/admin/signup-requests/:id/approve
POST   /api/v1/admin/signup-requests/:id/reject

# Wallet
GET    /api/v1/admin/agents/:id/wallet
POST   /api/v1/admin/agents/:id/wallet/credit
POST   /api/v1/admin/agents/:id/wallet/debit

# Bookings
GET    /api/v1/admin/bookings
GET    /api/v1/admin/bookings/:id

# Tax & Reports
GET    /api/v1/admin/tax-config
POST   /api/v1/admin/tax-config
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/reports/bookings
GET    /api/v1/admin/reports/revenue
```

---

## MENU STRUCTURE (CONSOLIDATED)

### Agent Panel Navigation

```
┌─────────────────────────────────────────────────────┐
│                    AGENT PORTAL                      │
├─────────────────────────────────────────────────────┤
│  ▸ Dashboard                                         │
│  ▸ Flight Booking                                    │
│      ├─ Search Flights                              │
│      ├─ One Way                                      │
│      ├─ Round Trip                                   │
│      └─ Multi-City                                   │
│  ▸ My Bookings                                       │
│      ├─ All Bookings                                │
│      ├─ Confirmed                                    │
│      ├─ Pending                                      │
│      └─ Cancelled                                    │
│  ▸ Wallet                                           │
│      ├─ Balance                                      │
│      └─ Transactions                                 │
│  ▸ My Profile                                       │
│      ├─ View Profile                                │
│      └─ Settings                                     │
└─────────────────────────────────────────────────────┘
```

### Admin Panel Navigation

```
┌─────────────────────────────────────────────────────┐
│                    ADMIN PANEL                       │
├─────────────────────────────────────────────────────┤
│  ▸ Dashboard                                         │
│  ▸ Agent Management                                  │
│      ├─ All Agents                                  │
│      ├─ Create Agent                                │
│      └─ Signup Approvals                            │
│  ▸ Groups & Schemes                                 │
│      ├─ Groups                                      │
│      └─ Schemes                                     │
│  ▸ API Providers                                    │
│      ├─ All Providers                               │
│      ├─ Airline Config                              │
│      └─ Commission Rules                            │
│  ▸ Bookings                                         │
│      ├─ All Bookings                                │
│      └─ Search                                       │
│  ▸ Wallet Management                                │
│      ├─ Agent Wallets                               │
│      └─ Credit/Debit                                │
│  ▸ Reports                                          │
│      ├─ Booking Reports                             │
│      └─ Revenue Reports                             │
│  ▸ Settings                                         │
│      └─ Tax Configuration                           │
└─────────────────────────────────────────────────────┘
```

### Super Admin Panel Navigation

```
┌─────────────────────────────────────────────────────┐
│                  SUPER ADMIN PANEL                   │
├─────────────────────────────────────────────────────┤
│  [All Admin Features]                                │
│  ▸ Admin Users                                      │
│      ├─ All Admins                                  │
│      ├─ Create Admin                                │
│      └─ Roles & Permissions                         │
│  ▸ System Settings                                  │
│      ├─ Global Config                               │
│      ├─ Notification Settings                       │
│      └─ API Defaults                                │
│  ▸ Audit Logs                                       │
│      ├─ Activity Log                                │
│      └─ Export                                       │
└─────────────────────────────────────────────────────┘
```

---

## NOTIFICATION FEATURES

### Notification Channels
- Email
- WhatsApp
- SMS

### Notification Events
- Agent Registration Confirmation
- Signup Approval/Rejection
- Password Reset
- Booking Confirmation
- Ticket Issued
- Booking Cancellation
- Status Change Notifications

---

*Document generated by Claude Code - B2B Travel Portal Analysis*
*End of Documentation*
