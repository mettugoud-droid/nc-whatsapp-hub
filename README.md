# Nature's Crates WhatsApp Hub

A production-ready, visually premium WhatsApp messaging platform built for **Nature's Crates** — enabling customer communication, marketing automation, COD-to-Prepaid conversion, campaign tracking, infographic generation, and business intelligence reporting through a unified dashboard.

## Features

### Core Messaging
- **Individual Messaging** — Send personalized WhatsApp messages to any number
- **Bulk Messaging** — Upload CSV/Excel for mass messaging with variable personalization
- **Template Manager** — Reusable templates (COD Confirmation, Shipping, Payments, Offers, etc.)
- **Message Scheduler** — Send now, schedule later, or set repeat campaigns
- **Campaign Logs** — Track sent, delivered, failed, pending, and read status

### COD-to-Prepaid Conversion Engine
- **Automatic Detection** — Identifies COD orders and initiates conversion workflow
- **Discount Engine** — Configurable 5-7% prepaid incentive
- **Razorpay Payment Links** — Auto-generated secure payment links with expiry
- **Automated Reminders** — 6h, 24h, 48h follow-ups (auto-cancelled on payment)
- **Real-time Webhook Updates** — Instant payment status via Razorpay webhooks

### Payment Gateway (Provider Pattern)
- **Multi-provider Architecture** — Switch between gateways without code changes
- **Razorpay** (implemented) — Full integration with payment links, webhooks, refunds
- **Future Providers** — Cashfree, PhonePe, PayU, Stripe, Paytm (interface ready)
- **Secure Credentials** — Encrypted storage, server-side API calls only

### Business Intelligence
- **Revenue Analytics** — Orders, revenue, AOV, customer LTV
- **COD vs Prepaid Metrics** — Conversion rates, discount analysis, ROI
- **AI Smart Insights** — Auto-generated business recommendations
- **Campaign ROI** — Per-campaign revenue and conversion tracking

### Infographic Builder
- **Campaign Summaries** — Visual infographics of campaign performance
- **Funnel Charts** — Customer response and conversion funnels
- **Export** — PNG, SVG, PDF, PowerPoint formats

### UI/UX
- **Nature's Crates Branding** — Primary #608748, Secondary #DFAD35
- **Glass Morphism** — Modern cards with soft shadows and blur effects
- **Dark Mode** — Full dark theme support
- **Responsive** — Desktop, tablet, and mobile optimized
- **Animations** — Framer Motion micro-interactions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| State | Zustand, TanStack Query |
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, NextAuth.js |
| Payments | Razorpay SDK |
| Charts | Recharts |
| Forms | React Hook Form, Zod validation |
| Deployment | Docker, Vercel, Railway |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/naturescrates/whatsapp-hub.git
cd natures-crates-whatsapp-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Project Structure

```
natures-crates-whatsapp-hub/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── analytics/     # BI & analytics
│   │   │   ├── campaigns/     # Campaign management
│   │   │   ├── cod-conversion/# COD conversion engine
│   │   │   ├── contacts/      # Contact management
│   │   │   ├── infographics/  # Infographic builder
│   │   │   ├── messages/      # Messaging interface
│   │   │   ├── payments/      # Payment tracking
│   │   │   ├── reports/       # Report generation
│   │   │   ├── settings/      # App configuration
│   │   │   └── templates/     # Template manager
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Login page
│   ├── components/
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── layout/            # Sidebar, Topbar
│   │   ├── providers/         # Theme, Query providers
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── server/
│       ├── middleware/        # Auth, error handling, logging
│       ├── routes/            # API route handlers
│       └── services/          # Business logic
│           ├── cod-conversion/ # COD conversion engine
│           ├── payment/        # Payment gateway (provider pattern)
│           └── whatsapp/       # WhatsApp Cloud API service
├── docker-compose.yml
├── Dockerfile
├── tailwind.config.ts
└── package.json
```

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/send` | Send individual message |
| POST | `/api/messages/bulk` | Send bulk messages |
| GET | `/api/messages` | List messages |

### COD Conversion
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cod-conversion/process` | Process single COD order |
| POST | `/api/cod-conversion/bulk-process` | Process multiple orders |
| POST | `/api/cod-conversion/:id/send-reminder` | Send reminder |
| GET | `/api/cod-conversion/stats` | Get conversion stats |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-link` | Create payment link |
| GET | `/api/payments/link/:id/status` | Get link status |
| POST | `/api/payments/test-connection` | Test gateway |
| GET | `/api/payments/providers` | List providers |
| POST | `/api/payments/provider/switch` | Switch provider |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/razorpay` | Razorpay payment events |
| POST | `/api/webhooks/whatsapp` | WhatsApp status updates |

## Security

- **Role-Based Access** — Admin, Marketing, Sales, Customer Support
- **JWT Authentication** — Secure token-based auth with expiry
- **Encrypted Credentials** — API keys stored encrypted in database
- **Server-Side Only** — Payment operations never exposed to client
- **Webhook Verification** — Signature verification for all webhooks
- **Audit Logging** — Complete trail of all sensitive actions
- **HTTPS Enforced** — All production traffic over TLS

## Roles & Permissions

| Feature | Admin | Marketing | Sales | Support |
|---------|-------|-----------|-------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Send Messages | ✅ | ✅ | ✅ | ✅ |
| Campaigns | ✅ | ✅ | ❌ | ❌ |
| Templates | ✅ | ✅ | ❌ | ❌ |
| COD Conversion | ✅ | ✅ | ✅ | ❌ |
| Payments | ✅ | ❌ | ✅ | ❌ |
| Analytics | ✅ | ✅ | 👁️ | 👁️ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

## Environment Variables

See `.env.example` for the complete list of required environment variables.

## License

Proprietary — Nature's Crates Private Limited. All rights reserved.
