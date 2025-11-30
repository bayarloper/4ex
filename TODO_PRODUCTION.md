# Production Deployment Checklist

## Environment Variables
Ensure the following environment variables are set in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon, Supabase, or Railway).
- `DISCORD_CLIENT_ID`: For Discord authentication.
- `DISCORD_CLIENT_SECRET`: For Discord authentication.
- `AUTH_SECRET`: A random string for NextAuth (generate with `openssl rand -base64 32`).
- `UPLOADTHING_SECRET`: Your UploadThing secret key.
- `UPLOADTHING_APP_ID`: Your UploadThing app ID.

## Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `next build` (or `npm run build`)
- **Install Command**: `npm install`
- **Output Directory**: `.next`

## Post-Deployment
1. **Database Migration**: The `postinstall` script in `package.json` runs `prisma generate`. You might need to run `prisma migrate deploy` manually or add it to your build command if you are managing migrations in production.
   - Recommended: Run `npx prisma migrate deploy` in the Vercel build command or as a separate step.

## Security
- Ensure your `AUTH_SECRET` is strong and unique.
- Verify that your database allows connections from Vercel's IP addresses (or use a connection pooler).

## SEO
- `robots.txt` and `sitemap.xml` are automatically generated.
- Update `app/sitemap.ts` with your actual domain name.
