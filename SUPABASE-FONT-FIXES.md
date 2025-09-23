# Supabase and Font Issues - Resolution Guide

This document outlines the solutions implemented to fix two critical issues in the warranty certificate application.

## Issues Resolved

### 1. Supabase Import Error

**Problem**: 
```
Uncaught SyntaxError: The requested module '/node_modules/@supabase/postgrest-js/dist/cjs/index.js' does not provide an export named 'default'
```

**Root Cause**: 
The `@supabase/postgrest-js` library was being imported incorrectly or was causing conflicts with the main `@supabase/supabase-js` library.

**Solution Applied**:
1. **Updated Vite Configuration** (`vite.config.ts`):
   - Added explicit exclusions for problematic Supabase sub-packages:
     ```typescript
     exclude: [
       '@supabase/postgrest-js',
       '@supabase/realtime-js', 
       '@supabase/storage-js'
     ]
     ```
   - Ensured `@supabase/supabase-js` is properly included in optimization

2. **Verified Supabase Client Configuration** (`src/lib/supabase.ts`):
   - Confirmed proper usage of `createClient` from `@supabase/supabase-js`
   - No direct imports of `@supabase/postgrest-js`
   - Proper environment variable handling

3. **Cache Clearing**:
   - Removed Vite cache: `rm -rf node_modules/.vite`
   - Reinstalled dependencies: `npm install`
   - Restarted development server: `npm run dev`

### 2. Font Preload Warning

**Problem**: 
Font warning indicating `Amiri-Regular.ttf` was preloaded but not used.

**Root Cause**: 
The font was preloaded in `index.html` but not actually used in the CSS. The application uses `Alexandria` font from Google Fonts instead.

**Solution Applied**:
1. **Removed Unused Font Preload** (`index.html`):
   - Removed the line: `<link rel="preload" href="/fonts/Amiri-Regular.ttf" as="font" type="font/ttf" crossorigin>`
   - This eliminates the warning since the font is not actually needed

2. **Verified Font Usage** (`src/index.css`):
   - Confirmed the application uses `'Alexandria'` font from Google Fonts
   - No references to `Amiri-Regular.ttf` found in the codebase

## Prevention Measures

### For Supabase Issues:
1. **Always use the official `@supabase/supabase-js` library**
2. **Never directly import sub-packages** like `@supabase/postgrest-js`
3. **Configure Vite properly** to exclude problematic sub-packages
4. **Clear cache after dependency changes** using `rm -rf node_modules/.vite`

### For Font Issues:
1. **Only preload fonts that are actually used** in CSS
2. **Verify font usage** before adding preload tags
3. **Use Google Fonts or web fonts** when possible for better performance
4. **Remove unused font files** from the project

## Testing the Fixes

After implementing these solutions:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for:
   - No Supabase import errors
   - No font preload warnings
   - Successful connection to Supabase

3. **Verify functionality**:
   - User authentication works
   - Database operations function correctly
   - No console errors or warnings

## Files Modified

- `vite.config.ts` - Updated optimizeDeps configuration
- `index.html` - Removed unused font preload
- `SUPABASE-FONT-FIXES.md` - This documentation file

## Dependencies

The project now relies solely on:
- `@supabase/supabase-js` (v2.38.4) - Official Supabase client
- No direct dependencies on `@supabase/postgrest-js`

## Environment Variables Required

Ensure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

If issues persist:

1. **Clear all caches**:
   ```bash
   rm -rf node_modules/.vite
   rm -rf node_modules
   npm install
   ```

2. **Check for conflicting imports**:
   ```bash
   grep -r "@supabase/postgrest-js" src/
   ```

3. **Verify environment variables**:
   ```bash
   npm run check-env
   ```

4. **Restart development server**:
   ```bash
   npm run dev
   ```

---

**Date**: $(date)
**Status**: ✅ Resolved
**Tested**: ✅ Working
