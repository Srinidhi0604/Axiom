# Axiom Production Launch Notes

This is the recommended 24-hour launch path for the integrated Axiom app.

## Platform Decision

Use **Vercel + MongoDB Atlas** for the first production launch.

Why:

- The app is a full Next.js App Router app with route handlers, MongoDB/Mongoose, JWT cookies, Google OAuth callbacks, and large static generated datasets.
- Vercel is the lowest-risk deployment path for Next.js and requires no runtime adapter work.
- Cloudflare Workers can run Next.js through OpenNext and has improving Node.js compatibility, but this app currently depends on a normal Node/Mongoose runtime. Shipping that to Cloudflare safely would need another adaptation and QA pass.

Use Cloudflare later for DNS, CDN/WAF, or a Workers migration once the app is stable.

## Required Environment Variables

Set these in Vercel project settings:

```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-at-least-32-random-characters
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
APP_URL=https://your-domain.com
MONGODB_MIN_POOL_SIZE=1
MONGODB_MAX_POOL_SIZE=20
```

For local development, use:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

## Google OAuth Setup

In Google Cloud Console, create an OAuth 2.0 Web Client and add these redirect URIs:

```text
http://localhost:3000/api/auth/callback
https://your-domain.com/api/auth/callback
```

## MongoDB Atlas Setup

Use Atlas rather than a self-hosted database for the first launch.

Recommended minimum:

- M10 if budget allows.
- M2/M5 can work for a small beta, but watch connection count and slow queries closely.

Database requirements:

- Use a single `MONGODB_URI` from Atlas.
- Enable database user auth with a strong generated password.
- Add indexes from the Mongoose schemas before opening signups.
- Keep question data static in `public/data/placement-questions.json`; do not move the 17k question catalog into MongoDB for launch.

## Runtime Notes

- Keep all MongoDB routes on the Node.js runtime.
- Do not switch auth/progress routes to Edge runtime while using Mongoose.
- Keep static placement data generated at build time with `npm run build:placement-data`.
- After editing `package.json`, restart the Next dev server so Turbopack reloads package metadata.

## Launch Checklist

1. Run `npm run build`.
2. Confirm the build logs show placement data generation.
3. Set all Vercel environment variables.
4. Add Google OAuth redirect URIs.
5. Deploy to Vercel from GitHub.
6. Test sign up, log in, Google auth, placement progress save, notes save, and one page from each vertical.
7. Watch Vercel function logs and Atlas metrics during the first user batch.
## Vibe Lab Repo Scanner

The Vibe Lab repo scanner is serverless inside this Next.js app. Do not deploy the old Vibe Lab `PORT=5000` Express service or set `CLIENT_ORIGIN` for production. The frontend calls the relative Vercel route:

```txt
POST /api/vibe/scan
```

Optional production env vars:

```txt
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MAX_TOKENS=4000
GITHUB_TOKEN=...
```

`GITHUB_TOKEN` is optional but recommended to raise GitHub API rate limits. Without `OPENAI_API_KEY`, the scanner still works and generates deterministic repo tasks from GitHub metadata.
