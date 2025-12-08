# Deployment Guide

## Overview

The site is deployed using:
- **Vercel** - Hosting the Next.js application
- **Sanity** - Content management (separate hosted service)
- **GitHub** - Source code repository (private)

## Prerequisites

1. GitHub account (for repository)
2. Vercel account (free tier)
3. Sanity account (free tier)

## Initial Setup

### 1. Create Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create new project"
3. Name: "Manuel Viveros Portfolio"
4. Dataset: "production"
5. Note the **Project ID** (you'll need this)

### 2. Configure Environment Variables

Create `.env.local` from the example:
```bash
cp .env.example .env.local
```

Fill in the values:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 3. Deploy to Vercel

#### Option A: Via GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
6. Add Environment Variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
7. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Configure Custom Domain

1. In Vercel dashboard, go to project Settings → Domains
2. Add your domain (e.g., `manuelviveros.art`)
3. Follow DNS configuration instructions
4. Vercel will auto-provision SSL certificate

### 5. Configure Sanity CORS

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to API → CORS origins
4. Add origins (check "Allow credentials" for each):
   - `http://localhost:3000` (for local dev)
   - `https://manuel-viveros-portfolio.vercel.app` (Vercel deployment)
   - `https://manuelviveros.art` (custom domain, when configured)

## Deployment Workflow

### Automatic Deployments
- Every push to `main` triggers a production deploy
- Pull requests get preview deployments

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Environment Variables

### Required
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (usually "production") |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version date |

### Optional
| Variable | Description |
|----------|-------------|
| `SANITY_API_TOKEN` | Read token for draft preview |

## Sanity Studio Access

The Sanity Studio is available at:
- **Local**: `http://localhost:3000/studio` (when running `npm run dev`)
- **Production**: `https://manuelviveros.art/studio`

Ensure your domain is added to Sanity CORS settings.

## Content Updates

Content updates in Sanity appear on the site after cache revalidation:
1. Log in to Sanity Studio
2. Edit content
3. Click "Publish"
4. Changes appear within ~60 seconds (no rebuild needed)

## Monitoring

### Vercel Analytics
1. Go to Vercel dashboard → Analytics
2. View page views, visitors, performance metrics
3. Free tier includes basic analytics

### Vercel Logs
1. Go to Vercel dashboard → Deployments
2. Click any deployment → View function logs
3. Useful for debugging server-side issues

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Import path issues

### Images Not Loading
1. Verify `cdn.sanity.io` is in `next.config.ts` remotePatterns
2. Verify Sanity CORS settings include your domain
3. Check browser console for errors
4. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct

### Studio Not Accessible
1. Add production domain to Sanity CORS
2. Clear browser cache
3. Check for authentication issues

## Rollback

To rollback to a previous deployment:
1. Go to Vercel dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

## Cost Summary

| Service | Free Tier Limits | Expected Usage |
|---------|------------------|----------------|
| Vercel | 100GB bandwidth/month | Well within limits |
| Sanity | 100K API requests/month | Well within limits |
| Sanity | 10GB asset storage | ~75-150 images = ~1-2GB |
| Domain | N/A | ~$12-15/year |
