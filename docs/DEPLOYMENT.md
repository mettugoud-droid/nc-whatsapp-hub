# Deployment Guide - Nature's Crates WhatsApp Hub

## Quick Start (Local Development)

```bash
# 1. Clone and install
git clone https://github.com/mettugoud-droid/nc-whatsapp-hub.git
cd nc-whatsapp-hub
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials (see below)

# 3. Set up database (requires PostgreSQL)
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
# Open http://localhost:3000
```

## Demo Login

- Email: `admin@naturescrates.in`
- Password: `admin123`

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/nc_whatsapp` |
| `NEXTAUTH_SECRET` | Random 32+ character secret | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | `openssl rand -base64 32` |

### Razorpay (for COD Conversion)

| Variable | Description | Get from |
|----------|-------------|----------|
| `RAZORPAY_KEY_ID` | API Key ID | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | API Secret | Same page as above |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook secret | Settings → Webhooks |

### WhatsApp Cloud API

| Variable | Description | Get from |
|----------|-------------|----------|
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID | [Meta Business](https://business.facebook.com/latest/whatsapp_manager) |
| `WHATSAPP_ACCESS_TOKEN` | Permanent access token | Meta Developer Portal |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WABA ID | Business Settings |

---

## Razorpay Setup

### 1. Create Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up for a business account
3. Complete KYC verification

### 2. Get API Keys
1. Go to **Settings → API Keys**
2. Click **Generate Key**
3. Copy `Key ID` and `Key Secret`
4. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Set Up Webhooks
1. Go to **Settings → Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`
3. Select events:
   - `payment_link.paid`
   - `payment_link.expired`
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret to `.env`:
   ```
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### 4. Test Mode
For testing, use test keys (starts with `rzp_test_`).
Switch to live keys for production.

---

## WhatsApp Cloud API Setup

### 1. Meta Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app (type: Business)
3. Add **WhatsApp** product

### 2. Configure Phone Number
1. In WhatsApp → Getting Started
2. Add a phone number or use the test number
3. Copy **Phone Number ID**

### 3. Generate Access Token
1. Go to **System Users** in Business Settings
2. Create a system user with `whatsapp_business_messaging` permission
3. Generate a permanent token
4. Add to `.env`:
   ```
   WHATSAPP_PHONE_NUMBER_ID=123456789
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxx...
   ```

### 4. Set Up Webhook
1. In your Meta App → WhatsApp → Configuration
2. Callback URL: `https://your-domain.com/api/webhooks/whatsapp`
3. Verify Token: `nature_crates_verify`
4. Subscribe to: `messages`, `message_status`

---

## Deploy to Vercel (Frontend)

### One-Click Deploy
1. Go to [vercel.com/import](https://vercel.com/import)
2. Import `https://github.com/mettugoud-droid/nc-whatsapp-hub`
3. Add environment variables
4. Deploy!

### Or via CLI:
```bash
npm i -g vercel
vercel
# Follow prompts, add env vars when asked
```

---

## Deploy Database (PostgreSQL)

### Option A: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Copy connection string from **Settings → Database**
4. Add to `DATABASE_URL`

### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copy connection URL

### Option C: Neon (Serverless)
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string

After setting `DATABASE_URL`:
```bash
npm run db:push    # Create tables
npm run db:seed    # Add sample data
```

---

## Deploy with Docker

```bash
# Build and run everything
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f app
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- App on port 3000 (frontend) + 4000 (API)

---

## Production Checklist

- [ ] PostgreSQL database provisioned
- [ ] Environment variables set (all required)
- [ ] Razorpay API keys configured
- [ ] WhatsApp Cloud API connected
- [ ] Webhooks registered (Razorpay + WhatsApp)
- [ ] HTTPS enabled (required for webhooks)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Admin user created (`npm run db:seed`)
- [ ] Backup schedule configured
- [ ] Monitoring/health check enabled
- [ ] Custom domain configured

---

## Monitoring

### Health Check Endpoint
```
GET /api/health
Response: { "status": "ok", "timestamp": "...", "version": "2.0.0" }
```

### Recommended Tools
- **Error Tracking**: Sentry (`SENTRY_DSN` env var)
- **Uptime**: UptimeRobot / Better Stack
- **Logs**: Vercel Logs / Railway Logs
- **APM**: Vercel Analytics (built-in)

---

## Support

For issues: [github.com/mettugoud-droid/nc-whatsapp-hub/issues](https://github.com/mettugoud-droid/nc-whatsapp-hub/issues)
