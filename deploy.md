# 🚀 Deployment Guide

## Step 1: Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Connect your GitHub account**
3. **Create New Web Service**
   - Repository: `DM-SaaS/legacy-fe-candidate-assignment`
   - Branch: `feature-setup-signer-verifier` (or `main`)
   - Root Directory: `apps/backend`
4. **Render will auto-detect settings from `render.yaml`, or manually configure:**

   - Build Command: `yarn install --frozen-lockfile && yarn build`
   - Start Command: `yarn start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `DYNAMIC_ENVIRONMENT_ID=3492aa47-61f0-4bda-ab2f-5bd3ef9fb701`

5. **Click "Deploy"** - takes ~5-10 minutes
6. **Copy the URL** (e.g., `https://web3-signer-backend-abc123.onrender.com`)

## Step 2: Update Frontend for Production

1. **Update the backend URL in frontend environment:**
   ```bash
   # Edit apps/frontend/.env.production
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```

## Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login
2. **Import your GitHub repository**
3. **Configure project:**
   - Framework Preset: `Vite`
   - Root Directory: `apps/frontend`
4. **Add Environment Variables:**

   - `VITE_DYNAMIC_ENVIRONMENT_ID=3492aa47-61f0-4bda-ab2f-5bd3ef9fb701`
   - `VITE_API_URL=https://your-render-backend-url.onrender.com/api`
   - `VITE_NODE_ENV=production`

5. **Deploy!** - takes ~2-5 minutes

## Step 4: Test Your Deployment

1. **Backend Health Check:**

   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Frontend Access:**
   - Visit your Vercel URL
   - Test the complete authentication flow:
     - Email authentication
     - Passkey MFA
     - Message signing
     - Signature verification

## 🔧 Troubleshooting

- **Build fails?** Check the build logs for missing dependencies
- **CORS errors?** Backend is configured to accept all origins in production
- **Environment variables not working?** Double-check they're set in the platform UI
- **404 on refresh?** Vercel rewrites are configured to handle React Router

## 🌐 Your URLs

After deployment, you'll have:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **API Health:** `https://your-backend.onrender.com/api/health`
