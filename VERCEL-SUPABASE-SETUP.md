# Vercel + Supabase Setup Guide

## ✅ Fixed Issues

The following issues have been resolved:

1. **Environment Variables**: All Supabase environment variables now use the `VITE_` prefix
2. **Supabase Client**: Single, clean Supabase client implementation
3. **Headers Error**: Fixed "Cannot read properties of undefined (reading 'headers')" error
4. **Vercel Configuration**: Updated `vercel.json` with proper environment variable handling

## 🔧 Environment Variables Setup

### Required Environment Variables

Add these environment variables in your Vercel dashboard:

```
VITE_SUPABASE_URL=https://rmaybqvpwqwymfvthhmd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5
```

### How to Add Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://rmaybqvpwqwymfvthhmd.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_iEbN6Lc-3tRTbcx5maMsIA_MzPKv6P5` | Production, Preview, Development |

5. Click **Save**
6. **Redeploy** your project

## 🚀 Deployment Steps

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Fix Supabase initialization and environment variables"
   git push origin main
   ```

2. **Vercel will automatically deploy** when you push to the main branch

3. **Verify the deployment** by checking:
   - No console errors in browser dev tools
   - Supabase connection works
   - Authentication functions properly

## 🧪 Testing

### Local Testing

1. **Copy environment variables**:
   ```bash
   cp .env.production .env.local
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Check browser console** for:
   - ✅ `[Supabase] Client initialized successfully`
   - ✅ No "headers undefined" errors
   - ✅ Environment variables are properly loaded

### Production Testing

1. **Deploy to Vercel**
2. **Open browser dev tools**
3. **Check console** for:
   - ✅ `[Supabase] Client initialized successfully`
   - ✅ No "headers undefined" errors
   - ✅ Supabase queries work correctly

## 🔍 Troubleshooting

### If you still see "headers undefined" error:

1. **Check environment variables** in Vercel dashboard
2. **Redeploy** the project after adding variables
3. **Clear browser cache** and hard refresh
4. **Check browser console** for environment variable logs

### If Supabase queries fail:

1. **Verify Supabase URL** format: `https://xxx.supabase.co`
2. **Verify Supabase key** format: starts with `eyJ` or `sb_`
3. **Check Supabase project** is active and accessible
4. **Verify database tables** exist and have proper permissions

## 📁 File Changes Made

### ✅ Updated Files:
- `src/lib/supabase.ts` - Single, clean Supabase client
- `vercel.json` - Added environment variable configuration

### 🗑️ Removed Files:
- `src/lib/supabase-client.ts` - Redundant
- `src/lib/supabase-simple.ts` - Redundant  
- `src/lib/supabase-fixed.ts` - Redundant
- `src/lib/env-validation.ts` - Integrated into main client

### 📝 Environment Files:
- `.env.example` - Template for environment variables
- `.env.production` - Production environment variables

## 🎯 Key Improvements

1. **Single Source of Truth**: One Supabase client file
2. **Proper Error Handling**: Clear error messages for missing variables
3. **Environment Validation**: Validates URL and key formats
4. **Vercel Integration**: Proper environment variable handling
5. **Debug Logging**: Helpful console logs for troubleshooting

## 🔐 Security Notes

- Environment variables with `VITE_` prefix are exposed to the client
- This is safe for Supabase URL and anon key (public keys)
- Never expose service role keys or other sensitive data
- The anon key has limited permissions based on your RLS policies

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify environment variables in Vercel dashboard
3. Ensure Supabase project is active
4. Check database permissions and RLS policies

The app should now work correctly on Vercel without the "headers undefined" error!
