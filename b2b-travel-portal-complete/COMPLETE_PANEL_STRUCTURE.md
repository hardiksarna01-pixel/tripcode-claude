# Complete Panel Structure - B2B/B2C Travel Portal

## Overview

This document provides the complete menu/branch structure for all panels in the travel portal.

---

## 🧑‍💼 AGENT PANEL (B2B)

### Main
| Menu Item | Path | Description |
|-----------|------|-------------|
| Dashboard | /agent/dashboard | Overview, stats, quick actions |
| My Bookings | /agent/bookings | All bookings list |
| Pending Bookings | /agent/bookings/pending | Awaiting confirmation |
| Cancelled Bookings | /agent/bookings/cancelled | Cancelled bookings |

### Search & Book
| Menu Item | Path | Description |
|-----------|------|-------------|
| Flights | /flights | Flight search |
| Hotels | /hotels | Hotel search |
| Bus | /bus | Bus ticket booking |
| Holidays | /holidays | Holiday packages |
| Activities & Tours | /activities | Tours and experiences |
| Travel Insurance | /insurance | Insurance plans |
| Visa Services | /visa | Visa application |
| Airport Transfers | /transfers | Transfer booking |

### AI Features
| Menu Item | Path | Description |
|-----------|------|-------------|
| AI Trip Planner | /ai/trip-planner | AI-powered itinerary builder |
| AI Chatbot | /ai/chat | Travel assistant chat |
| AI Image Generator | /ai/image-generator | Generate travel images |
| Smart Search | /ai/smart-search | Natural language search |
| Price Prediction | /ai/price-prediction | Price forecast |

### Tools
| Menu Item | Path | Description |
|-----------|------|-------------|
| Fare Calendar | /tools/fare-calendar | Price calendar view |
| Price Alerts | /tools/price-alerts | Set price alerts |
| Search History | /tools/search-history | Recent searches |
| Saved Searches | /tools/saved-searches | Bookmarked searches |
| Compare Prices | /tools/compare | Price comparison |

### Wallet & Finance
| Menu Item | Path | Description |
|-----------|------|-------------|
| Wallet | /agent/wallet | Wallet overview |
| Top-up Wallet | /agent/wallet/topup | Add funds |
| Transaction History | /agent/wallet/transactions | All transactions |
| Credit Balance | /agent/wallet/credit | Credit details |
| Download Statement | /agent/wallet/statement | Account statement |

### Commission
| Menu Item | Path | Description |
|-----------|------|-------------|
| Commission Dashboard | /agent/commission | Commission overview |
| Commission History | /agent/commission/history | Past commissions |
| Pending Payouts | /agent/commission/pending | Awaiting payout |

### My Markup
| Menu Item | Path | Description |
|-----------|------|-------------|
| Markup Settings | /agent/markup | Markup configuration |
| Flight Markup | /agent/markup/flights | Flight-specific markup |
| Hotel Markup | /agent/markup/hotels | Hotel-specific markup |
| Other Products | /agent/markup/others | Other product markup |

### Sub-Agents
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Sub-Agents | /agent/sub-agents | List of sub-agents |
| Add Sub-Agent | /agent/sub-agents/add | Create sub-agent |
| Sub-Agent Bookings | /agent/sub-agents/bookings | Sub-agent bookings |

### Travelers
| Menu Item | Path | Description |
|-----------|------|-------------|
| Saved Travelers | /agent/travelers | Passenger list |
| Add Traveler | /agent/travelers/add | Add new traveler |
| Frequent Travelers | /agent/travelers/frequent | VIP travelers |

### Group Bookings
| Menu Item | Path | Description |
|-----------|------|-------------|
| Group Inquiries | /agent/group-bookings | All group requests |
| Create Group Inquiry | /agent/group-bookings/new | New group request |
| Group Quotes | /agent/group-bookings/quotes | Received quotes |

### Changes & Cancellations
| Menu Item | Path | Description |
|-----------|------|-------------|
| Amendment Requests | /agent/amendments | All change requests |
| Pending Changes | /agent/amendments/pending | Awaiting processing |
| Cancellation Requests | /agent/cancellations | Cancel requests |
| Refund Status | /agent/refunds | Refund tracking |

### Reports
| Menu Item | Path | Description |
|-----------|------|-------------|
| Booking Reports | /agent/reports/bookings | Booking analytics |
| Sales Reports | /agent/reports/sales | Revenue reports |
| Commission Reports | /agent/reports/commission | Earnings report |
| Download Reports | /agent/reports/download | Export data |

### Support
| Menu Item | Path | Description |
|-----------|------|-------------|
| Raise Ticket | /agent/support/new | New support ticket |
| My Tickets | /agent/support/tickets | All tickets |
| FAQs | /agent/support/faqs | Help articles |
| Contact Us | /agent/support/contact | Contact options |

### Account
| Menu Item | Path | Description |
|-----------|------|-------------|
| Profile | /agent/profile | Account details |
| KYC Documents | /agent/profile/kyc | Document upload |
| Notifications | /agent/notifications | Alerts & messages |
| Settings | /agent/settings | Preferences |

---

## 👨‍💻 ADMIN PANEL

### Overview
| Menu Item | Path | Description |
|-----------|------|-------------|
| Dashboard | /admin/dashboard | Main dashboard |
| Real-time Stats | /admin/dashboard/realtime | Live metrics |

### Agent Management
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Agents | /admin/agents | Agent list |
| Pending Approval | /admin/agents/pending | Awaiting approval |
| Approved Agents | /admin/agents/approved | Active agents |
| Suspended Agents | /admin/agents/suspended | Blocked agents |
| Add New Agent | /admin/agents/add | Create agent |
| Agent Groups | /admin/groups | Group management |
| Commission Schemes | /admin/schemes | Scheme setup |
| Credit Management | /admin/agents/credit | Credit control |
| KYC Verification | /admin/agents/kyc | Document review |

### Customer Management
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Customers | /admin/customers | Customer list |
| Active Customers | /admin/customers/active | Active users |
| Customer Bookings | /admin/customers/bookings | B2C bookings |

### Bookings
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Bookings | /admin/bookings | All bookings |
| Pending | /admin/bookings/pending | Pending bookings |
| Confirmed | /admin/bookings/confirmed | Confirmed |
| Cancelled | /admin/bookings/cancelled | Cancelled |
| Refund Requests | /admin/bookings/refunds | Refund queue |
| Failed Bookings | /admin/bookings/failed | Failed transactions |
| Group Bookings | /admin/bookings/group | Group requests |

### Products
| Menu Item | Path | Description |
|-----------|------|-------------|
| Product Settings | /admin/products | Enable/disable |
| Flights | /admin/products/flights | Flight config |
| Hotels | /admin/products/hotels | Hotel config |
| Bus | /admin/products/bus | Bus config |
| Holidays | /admin/products/holidays | Holiday config |
| Activities | /admin/products/activities | Activity config |
| Insurance | /admin/products/insurance | Insurance config |
| Visa | /admin/products/visa | Visa config |
| Transfers | /admin/products/transfers | Transfer config |

### Suppliers & APIs
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Suppliers | /admin/suppliers | Supplier list |
| Flight APIs | /admin/suppliers/flights | Flight suppliers |
| Hotel APIs | /admin/suppliers/hotels | Hotel suppliers |
| Bus APIs | /admin/suppliers/bus | Bus suppliers |
| API Logs | /admin/suppliers/logs | Request logs |
| API Health | /admin/suppliers/health | Status monitor |

### Markup & Pricing
| Menu Item | Path | Description |
|-----------|------|-------------|
| Global Markup | /admin/markup | Global rules |
| Flight Markup | /admin/markup/flights | Flight markup |
| Hotel Markup | /admin/markup/hotels | Hotel markup |
| Group Markup | /admin/markup/groups | Per-group markup |
| Agent Markup | /admin/markup/agents | Per-agent markup |
| Route-wise Markup | /admin/markup/routes | Route-specific |
| Seasonal Markup | /admin/markup/seasonal | Time-based |
| Markup Calculator | /admin/markup/calculator | Preview tool |

### Finance
| Menu Item | Path | Description |
|-----------|------|-------------|
| Finance Dashboard | /admin/finance | Finance overview |
| Invoices | /admin/finance/invoices | Invoice management |
| Ledger | /admin/finance/ledger | Account ledger |
| Wallet Transactions | /admin/finance/wallet | Wallet ops |
| Pending Payments | /admin/finance/pending | Payment queue |
| Commission Payouts | /admin/finance/commissions | Payout management |
| Refund Management | /admin/finance/refunds | Refund processing |
| GST Reports | /admin/finance/gst | GST compliance |
| TDS Reports | /admin/finance/tds | TDS compliance |
| Reconciliation | /admin/finance/reconciliation | Reconcile accounts |

### Reports & Analytics
| Menu Item | Path | Description |
|-----------|------|-------------|
| Reports Dashboard | /admin/reports | Report hub |
| Booking Reports | /admin/reports/bookings | Booking data |
| Revenue Reports | /admin/reports/revenue | Revenue analysis |
| Agent Performance | /admin/reports/agents | Agent metrics |
| Product Reports | /admin/reports/products | Product analysis |
| Cancellation Reports | /admin/reports/cancellations | Cancel trends |
| Search Analytics | /admin/reports/search | Search patterns |
| Custom Reports | /admin/reports/custom | Build reports |
| Scheduled Reports | /admin/reports/scheduled | Auto reports |
| Export Data | /admin/reports/export | Download data |

### Communication
| Menu Item | Path | Description |
|-----------|------|-------------|
| Email Templates | /admin/templates/email | Email designs |
| SMS Templates | /admin/templates/sms | SMS messages |
| WhatsApp Templates | /admin/templates/whatsapp | WhatsApp msgs |
| Push Notifications | /admin/templates/push | Push templates |
| PDF Templates | /admin/templates/pdf | Invoice/voucher |
| Send Bulk SMS | /admin/communication/bulk-sms | Mass SMS |
| Send Bulk Email | /admin/communication/bulk-email | Mass email |

### Whitelabel & Branding
| Menu Item | Path | Description |
|-----------|------|-------------|
| Branding | /admin/whitelabel | Brand settings |
| Logo & Favicon | /admin/whitelabel/logo | Logo upload |
| Theme & Colors | /admin/whitelabel/theme | Color scheme |
| Custom Domain | /admin/whitelabel/domain | Domain setup |
| SEO Settings | /admin/whitelabel/seo | SEO config |
| Custom Pages | /admin/whitelabel/pages | Static pages |
| Footer Settings | /admin/whitelabel/footer | Footer content |
| Social Links | /admin/whitelabel/social | Social media |

### Fare Calendar
| Menu Item | Path | Description |
|-----------|------|-------------|
| Fare Calendar | /admin/fare-calendar | Calendar setup |
| Flight Fares | /admin/fare-calendar/flights | Flight prices |
| Hotel Rates | /admin/fare-calendar/hotels | Hotel rates |
| Update Fares | /admin/fare-calendar/update | Bulk update |

### Support
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Tickets | /admin/support | Ticket queue |
| Open Tickets | /admin/support/open | Active tickets |
| Closed Tickets | /admin/support/closed | Resolved |
| FAQs Management | /admin/support/faqs | FAQ editor |

### Notifications & Alerts
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Notifications | /admin/notifications | Notification center |
| Announcements | /admin/announcements | Portal announcements |
| System Alerts | /admin/alerts | Critical alerts |

### Settings
| Menu Item | Path | Description |
|-----------|------|-------------|
| General Settings | /admin/settings | Basic config |
| Business Settings | /admin/settings/business | Business info |
| Booking Settings | /admin/settings/booking | Booking rules |
| Payment Gateways | /admin/settings/payments | Gateway config |
| Tax Settings (GST) | /admin/settings/tax | Tax config |
| Email/SMS Config | /admin/settings/communication | Provider setup |
| Currency Settings | /admin/settings/currency | Currency options |
| API Keys | /admin/api-keys | External APIs |
| Webhooks | /admin/settings/webhooks | Webhook config |

### Audit & Logs
| Menu Item | Path | Description |
|-----------|------|-------------|
| Audit Logs | /admin/audit | Activity log |
| Admin Activity | /admin/audit/admin | Admin actions |
| Agent Activity | /admin/audit/agents | Agent actions |
| API Request Logs | /admin/audit/api | API logs |

---

## 🛡️ SUPER ADMIN PANEL

### Platform Overview
| Menu Item | Path | Description |
|-----------|------|-------------|
| Dashboard | /superadmin/dashboard | Platform stats |
| Platform Stats | /superadmin/stats | Metrics |
| Real-time Monitor | /superadmin/monitor | Live view |

### Tenant Management
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Tenants | /superadmin/tenants | Tenant list |
| Active Tenants | /superadmin/tenants/active | Active |
| Suspended Tenants | /superadmin/tenants/suspended | Blocked |
| Add New Tenant | /superadmin/tenants/add | Create tenant |
| Tenant Features | /superadmin/tenants/features | Feature toggle |
| Tenant Limits | /superadmin/tenants/limits | Quota management |
| Tenant Billing | /superadmin/tenants/billing | Billing management |

### Admin Users
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Admins | /superadmin/admins | Admin list |
| Add Admin | /superadmin/admins/add | Create admin |
| Role Management | /superadmin/roles | Role CRUD |
| Permissions | /superadmin/permissions | Permission matrix |

### Supplier Configuration
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Suppliers | /superadmin/suppliers | Supplier list |
| Flight Suppliers | /superadmin/suppliers/flights | Flight APIs |
| Hotel Suppliers | /superadmin/suppliers/hotels | Hotel APIs |
| Bus Suppliers | /superadmin/suppliers/bus | Bus APIs |
| Activity Suppliers | /superadmin/suppliers/activities | Activity APIs |
| Add Supplier | /superadmin/suppliers/add | New supplier |
| API Credentials | /superadmin/suppliers/credentials | Credentials |
| Supplier Priority | /superadmin/suppliers/priority | Priority order |

### Payment Gateways
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Gateways | /superadmin/payment-gateways | Gateway list |
| Razorpay | /superadmin/payment-gateways/razorpay | Razorpay config |
| PayU | /superadmin/payment-gateways/payu | PayU config |
| Stripe | /superadmin/payment-gateways/stripe | Stripe config |
| CCAvenue | /superadmin/payment-gateways/ccavenue | CCAvenue config |
| Test Connection | /superadmin/payment-gateways/test | Test gateways |

### Communication Config
| Menu Item | Path | Description |
|-----------|------|-------------|
| Email Provider | /superadmin/communication/email | SMTP/SendGrid |
| SMS Provider | /superadmin/communication/sms | MSG91/Twilio |
| WhatsApp Provider | /superadmin/communication/whatsapp | WATI/Meta |
| Push Notifications | /superadmin/communication/push | Push config |

### AI Configuration
| Menu Item | Path | Description |
|-----------|------|-------------|
| AI Settings | /superadmin/ai | AI overview |
| OpenAI Config | /superadmin/ai/openai | OpenAI setup |
| Anthropic Config | /superadmin/ai/anthropic | Claude setup |
| Image Generation | /superadmin/ai/images | DALL-E config |
| AI Usage & Costs | /superadmin/ai/usage | Usage tracking |

### Feature Flags
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Features | /superadmin/features | Feature list |
| Enable/Disable | /superadmin/features/toggle | Toggle features |
| Beta Features | /superadmin/features/beta | Beta flags |

### Platform Reports
| Menu Item | Path | Description |
|-----------|------|-------------|
| Revenue Report | /superadmin/reports/revenue | Platform revenue |
| Tenant Report | /superadmin/reports/tenants | Tenant metrics |
| Usage Report | /superadmin/reports/usage | Usage analytics |
| API Usage | /superadmin/reports/api | API metrics |
| Commission Report | /superadmin/reports/commission | Commissions |

### System Health
| Menu Item | Path | Description |
|-----------|------|-------------|
| System Overview | /superadmin/health | Health dashboard |
| Server Status | /superadmin/health/servers | Server metrics |
| Database Status | /superadmin/health/database | DB health |
| Cache Status | /superadmin/health/cache | Redis status |
| Queue Status | /superadmin/health/queues | Job queues |
| API Health | /superadmin/health/api | API status |

### Security
| Menu Item | Path | Description |
|-----------|------|-------------|
| Security Dashboard | /superadmin/security | Security overview |
| DDoS Protection | /superadmin/security/ddos | DDoS settings |
| Rate Limiting | /superadmin/security/rate-limit | Rate limits |
| Blocked IPs | /superadmin/security/blocked | IP blacklist |
| Security Logs | /superadmin/security/logs | Security events |

### Logs & Monitoring
| Menu Item | Path | Description |
|-----------|------|-------------|
| System Logs | /superadmin/logs | All logs |
| Error Logs | /superadmin/logs/errors | Error log |
| API Logs | /superadmin/logs/api | API log |
| Audit Logs | /superadmin/logs/audit | Audit trail |
| Security Logs | /superadmin/logs/security | Security log |

### Maintenance
| Menu Item | Path | Description |
|-----------|------|-------------|
| Maintenance Mode | /superadmin/maintenance | Maintenance |
| Enable Maintenance | /superadmin/maintenance/enable | Turn on |
| Schedule Maintenance | /superadmin/maintenance/schedule | Schedule |

### Backup & Restore
| Menu Item | Path | Description |
|-----------|------|-------------|
| Backups | /superadmin/backups | Backup list |
| Create Backup | /superadmin/backups/create | New backup |
| Restore Backup | /superadmin/backups/restore | Restore |
| Scheduled Backups | /superadmin/backups/scheduled | Auto backup |

### Cache Management
| Menu Item | Path | Description |
|-----------|------|-------------|
| Cache Overview | /superadmin/cache | Cache stats |
| Clear All Cache | /superadmin/cache/clear | Flush cache |
| Warm Cache | /superadmin/cache/warm | Pre-warm |

### Announcements
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Announcements | /superadmin/announcements | Announcement list |
| Create Announcement | /superadmin/announcements/create | New announcement |
| Scheduled | /superadmin/announcements/scheduled | Future posts |

### Platform Settings
| Menu Item | Path | Description |
|-----------|------|-------------|
| General Settings | /superadmin/settings | Platform config |
| Security Settings | /superadmin/settings/security | Security rules |
| Rate Limiting | /superadmin/settings/rate-limit | Rate config |
| CORS Settings | /superadmin/settings/cors | CORS config |

---

## 👤 CUSTOMER PANEL (B2C)

### Dashboard
| Menu Item | Path | Description |
|-----------|------|-------------|
| My Dashboard | /my/dashboard | Customer home |

### My Bookings
| Menu Item | Path | Description |
|-----------|------|-------------|
| All Bookings | /my/bookings | Booking list |
| Upcoming Trips | /my/bookings/upcoming | Future trips |
| Completed Trips | /my/bookings/completed | Past trips |
| Cancelled | /my/bookings/cancelled | Cancelled |
| Refund Status | /my/bookings/refunds | Refund tracking |

### Quick Book
| Menu Item | Path | Description |
|-----------|------|-------------|
| Flights | /flights | Flight search |
| Hotels | /hotels | Hotel search |
| Bus | /bus | Bus search |
| Holidays | /holidays | Packages |
| Activities | /activities | Tours |
| Insurance | /insurance | Insurance |
| Visa | /visa | Visa services |

### AI Assistant
| Menu Item | Path | Description |
|-----------|------|-------------|
| AI Trip Planner | /ai/trip-planner | Plan trip |
| AI Chat | /ai/chat | Chat assistant |
| Smart Recommendations | /ai/recommendations | Personalized |

### Travelers
| Menu Item | Path | Description |
|-----------|------|-------------|
| Saved Travelers | /my/travelers | Passenger list |
| Add Traveler | /my/travelers/add | New traveler |

### Saved & Favorites
| Menu Item | Path | Description |
|-----------|------|-------------|
| Wishlist | /my/wishlist | Saved items |
| Saved Searches | /my/saved-searches | Bookmarked |
| Price Alerts | /my/price-alerts | Price watch |
| Recent Searches | /my/recent | History |

### Rewards
| Menu Item | Path | Description |
|-----------|------|-------------|
| My Rewards | /my/rewards | Points balance |
| Points History | /my/rewards/history | Earning history |
| Redeem Points | /my/rewards/redeem | Use points |

### Reviews
| Menu Item | Path | Description |
|-----------|------|-------------|
| My Reviews | /my/reviews | Posted reviews |
| Write a Review | /my/reviews/write | New review |

### Payments
| Menu Item | Path | Description |
|-----------|------|-------------|
| Payment Methods | /my/payments | Saved cards |
| Transaction History | /my/payments/history | Past payments |

### Support
| Menu Item | Path | Description |
|-----------|------|-------------|
| Help Center | /my/help | Help articles |
| My Tickets | /my/support/tickets | Support tickets |
| Contact Us | /my/support/contact | Contact |

### Account
| Menu Item | Path | Description |
|-----------|------|-------------|
| Profile | /my/profile | Account info |
| Notifications | /my/notifications | Alerts |
| Settings | /my/settings | Preferences |

---

## 🔒 SECURITY FEATURES

| Feature | Description |
|---------|-------------|
| DDoS Protection | Rate limiting + IP blocking |
| Rate Limiting | Per-endpoint limits |
| Input Validation | XSS/SQL injection prevention |
| Audit Logging | Complete activity trail |
| Security Headers | Helmet.js integration |
| Encryption Services | AES-256-GCM encryption |
| Fault Tolerance | Circuit breaker pattern |
| Health Monitoring | Real-time metrics |

---

## 🤖 AI FEATURES

| Feature | Description |
|---------|-------------|
| AI Smart Search | Natural language query parsing |
| AI Itinerary Builder | Day-by-day trip planning |
| AI Image Generator | DALL-E integration |
| AI Chatbot | Travel assistant |
| Price Prediction | Best time to book |
| Usage Limits | Per-plan quotas |
| AI Billing | Cost tracking |

---

## 📊 TOTAL FEATURE COUNT

| Panel | Menu Sections | Total Items |
|-------|---------------|-------------|
| Agent Panel | 14 | 65+ |
| Admin Panel | 17 | 120+ |
| Super Admin Panel | 17 | 85+ |
| Customer Panel | 12 | 40+ |
| **TOTAL** | **60** | **310+** |

---

*Document generated for B2B/B2C Travel Portal - Complete Feature Set*
