# API Documentation - Nature's Crates WhatsApp Hub

Base URL: `http://localhost:4000/api` (development) or `https://your-domain.com/api`

## Authentication

All endpoints require Bearer token (except `/api/auth/login`):
```
Authorization: Bearer <jwt_token>
```

---

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/register` | Register new user |
| GET | `/auth/me` | Get current user |

---

## Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages/send` | Send individual WhatsApp message |
| POST | `/messages/bulk` | Send bulk messages |
| GET | `/messages` | List sent messages |

---

## Inbox (Unified WhatsApp)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inbox/conversations` | List conversations |
| GET | `/inbox/conversations/:id/messages` | Get chat messages |
| POST | `/inbox/conversations/:id/send` | Send reply |
| POST | `/inbox/conversations/:id/note` | Add internal note |
| POST | `/inbox/conversations/:id/assign` | Assign to employee |
| PUT | `/inbox/conversations/:id/status` | Update status |
| POST | `/inbox/incoming` | Handle incoming message |
| GET | `/inbox/stats` | Inbox metrics |
| GET | `/inbox/quick-replies` | Get quick replies |
| GET | `/inbox/canned-responses` | Get canned responses |

---

## Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns` | Create campaign |
| POST | `/campaigns/:id/start` | Start campaign |
| POST | `/campaigns/:id/pause` | Pause campaign |

---

## Contacts & CRM

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List contacts |
| POST | `/contacts` | Create contact |
| POST | `/contacts/import` | Import from CSV/Excel |
| GET | `/crm/customers` | Customer profiles |
| GET | `/crm/customers/:id/profile` | Full profile |
| GET | `/crm/segments` | Segment breakdown |

---

## COD Conversion

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cod-conversion/process` | Process single COD order |
| POST | `/cod-conversion/bulk-process` | Process multiple |
| POST | `/cod-conversion/:id/send-reminder` | Send reminder |
| GET | `/cod-conversion/stats` | Conversion metrics |

---

## Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create-link` | Create Razorpay payment link |
| GET | `/payments/link/:id/status` | Payment link status |
| POST | `/payments/test-connection` | Test gateway |
| GET | `/payments/providers` | List providers |
| POST | `/payments/provider/switch` | Switch active provider |

---

## Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | List tickets |
| POST | `/tickets` | Create ticket |
| POST | `/tickets/auto-detect` | Auto-create from message |
| PUT | `/tickets/:id/status` | Update status |
| POST | `/tickets/:id/assign` | Assign to employee |
| POST | `/tickets/:id/note` | Add note |
| GET | `/tickets/stats` | Ticket metrics |

---

## Workflows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows` | List workflows |
| GET | `/workflows/templates` | Pre-built templates |
| POST | `/workflows` | Create workflow |
| PUT | `/workflows/:id/toggle` | Activate/deactivate |
| POST | `/workflows/:id/execute` | Trigger execution |

---

## Upload Engine

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/preview` | Parse & preview file |
| POST | `/upload/start` | Start import job |
| GET | `/upload/job/:id` | Job status |
| GET | `/upload/history` | Import history |
| GET | `/upload/job/:id/errors` | Download error log |

---

## AI & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ai/recommendations` | AI insights |
| GET | `/ai/best-times` | Optimal send times |
| GET | `/ai/template-performance` | Template analysis |
| GET | `/analytics/dashboard` | Dashboard overview |
| GET | `/analytics/business-intelligence` | BI metrics |
| GET | `/analytics/cod-conversion` | Conversion analytics |

---

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/templates` | Available reports |
| POST | `/reports/generate` | Generate report |
| POST | `/reports/schedule` | Schedule recurring |
| GET | `/reports/scheduled` | List scheduled |

---

## Integrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/integrations` | List all integrations |
| POST | `/integrations/:name/connect` | Connect provider |
| POST | `/integrations/:name/test` | Test connection |
| POST | `/integrations/:name/sync` | Manual sync |
| POST | `/integrations/sync-all` | Sync all enabled |

---

## Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/razorpay` | Razorpay payment events |
| POST | `/webhooks/whatsapp` | WhatsApp status updates |
| GET | `/webhooks/whatsapp` | WhatsApp verification |

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | System health check |
