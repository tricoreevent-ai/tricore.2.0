# Hostinger Deployment

## Recommended Setup

- Deployment source: GitHub repository connection
- Node.js version: `22.x`
- Build command: `npm run hostinger:build`
- Start command: `npm run hostinger:start`
- Application port: `5000`

The root bootstrap file is [server.js](/c:/Works/Tricore%202.0/server.js). It loads the ESM server entry in a way that works with Hostinger's Node.js launcher.

## Environment Files

- Server template: [server/.env.hostinger.example](/c:/Works/Tricore%202.0/server/.env.hostinger.example)
- Client build-time template: [client/.env.hostinger.example](/c:/Works/Tricore%202.0/client/.env.hostinger.example)

## Deploy Flow

1. Push the current branch to GitHub.
2. In hPanel, create or redeploy the Node.js application from GitHub.
3. Select Node.js `22.x`.
4. Set the build command to `npm run hostinger:build`.
5. Set the start command to `npm run hostinger:start`.
6. Import the environment variables from the example files above, then replace every placeholder value with your production values.
7. Redeploy after any environment variable or build-setting change.

## Production Notes

- Keep `PORT=5000` unless you intentionally change the server port in the deployment settings too.
- Leave `VITE_API_URL` blank when the built frontend is served by the same Node.js app, so the browser uses relative `/api` requests.
- Set `CLIENT_URL` to your production domain list only.
- Use a production MongoDB Atlas connection string and disable memory fallback in production.
- Update Google OAuth authorized origins so they exactly match `VITE_GOOGLE_ALLOWED_ORIGINS`.
