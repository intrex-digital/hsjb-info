# Deployment Guide - hsjb.info

## Overview

This portfolio website is deployed on Cloudflare:
- **Frontend**: Cloudflare Pages
- **Backend API**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)

---

## Prerequisites

1. **Cloudflare Account** (free tier works)
2. **Wrangler CLI** installed globally
3. **Node.js 20+** installed
4. **Git** repository (GitHub recommended)

---

## Initial Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
cd backend
wrangler d1 create hsjb-info-db
```

Copy the `database_id` from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hsjb-info-db"
database_id = "YOUR_DATABASE_ID"
```

### 4. Initialize Database

```bash
cd backend
npm run db:setup
```

This creates all tables and seeds the data (17 skills, 16 resume entries, 37 blog posts).

---

## Local Development

### Start Backend API

```bash
cd backend
npm run dev
# API runs at http://localhost:8787
```

### Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:3000
```

The frontend proxies `/api` requests to the backend automatically.

---

## Manual Deployment

### Deploy Backend (Cloudflare Workers)

```bash
cd backend
npm run deploy
```

### Deploy Frontend (Cloudflare Pages)

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=hsjb-info
```

---

## Automatic Deployment (GitHub Actions)

### Required Secrets

Add these secrets in your GitHub repository settings:

| Secret Name | Description |
|-------------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers and Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Create API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template
4. Add permissions for:
   - Workers
   - Pages
   - D1
5. Copy the token and add to GitHub secrets

### Get Account ID

1. Go to Cloudflare dashboard
2. Select any domain
3. Find Account ID in the right sidebar

### Deployment Process

1. Push code to `main` branch
2. GitHub Actions automatically:
   - Runs TypeScript checks
   - Builds frontend
   - Deploys backend to Workers
   - Deploys frontend to Pages

---

## Custom Domain Setup

### 1. Add Domain to Cloudflare

1. Go to Cloudflare dashboard
2. Click "Add a Site"
3. Enter `hsjb.info`
4. Choose plan (free works)
5. Update nameservers at your registrar

### 2. Configure Pages Custom Domain

1. Go to Pages project settings
2. Click "Custom domains"
3. Add `hsjb.info` and `www.hsjb.info`

### 3. Configure Workers Route (Optional)

If you want `api.hsjb.info` for the backend:

1. Go to Workers settings
2. Add route: `api.hsjb.info/*`
3. Assign to your worker

---

## Environment Variables

### Backend (wrangler.toml)

```toml
[vars]
ENVIRONMENT = "production"
```

### Frontend (.env.production)

```
VITE_API_URL=https://api.hsjb.info
```

---

## Database Management

### View Data

```bash
# List blog posts
wrangler d1 execute hsjb-info-db --command="SELECT COUNT(*) FROM blog_posts"

# View a specific post
wrangler d1 execute hsjb-info-db --command="SELECT title FROM blog_posts WHERE id=1"
```

### Reset Database

```bash
cd backend
npm run db:setup
```

### Backup Database

```bash
wrangler d1 backup create hsjb-info-db
```

---

## Troubleshooting

### API Not Responding

1. Check Worker logs: `wrangler tail`
2. Verify D1 binding in `wrangler.toml`
3. Check database exists: `wrangler d1 list`

### Frontend Not Loading

1. Check Pages build logs
2. Verify `VITE_API_URL` environment variable
3. Check browser console for CORS errors

### Database Connection Error

1. Verify `database_id` in `wrangler.toml`
2. Ensure database is initialized: `npm run db:setup`
3. Check D1 bindings in Cloudflare dashboard

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Pages | 500 builds/month | $5/1000 builds |
| Workers | 100,000 requests/day | $0.50/million |
| D1 | 5GB storage, 5M reads/day | $0.75/GB storage |

**Note**: This portfolio site will comfortably fit within the free tier.

---

## Support

For issues with:
- **Cloudflare**: Check [Cloudflare Docs](https://developers.cloudflare.com)
- **Wrangler**: Check [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler)
- **D1**: Check [D1 Docs](https://developers.cloudflare.com/d1)
