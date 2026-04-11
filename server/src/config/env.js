import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { resolveEnvFilePath } from '../../../scripts/resolve-env-file.mjs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '../../..');

const splitCsv = (value) =>
  (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const hasPlaceholderToken = (value, tokens) => {
  const normalizedValue = String(value || '').trim().toLowerCase();

  if (!normalizedValue) {
    return false;
  }

  return tokens.some((token) => normalizedValue.includes(token.toLowerCase()));
};

const readConfiguredValue = (value, placeholderTokens = []) => {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    return '';
  }

  return hasPlaceholderToken(normalizedValue, placeholderTokens) ? '' : normalizedValue;
};

const envFilePath = resolveEnvFilePath(rootDir);

if (envFilePath) {
  dotenv.config({
    path: envFilePath
  });
}

const googleClientIds = Array.from(
  new Set(
    splitCsv([process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_IDS].filter(Boolean).join(',')).filter(
      (clientId) => !hasPlaceholderToken(clientId, ['your-google-client-id'])
    )
  )
);

const nodeEnv = process.env.NODE_ENV || 'development';
const defaultLocalClientUrls = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];
const configuredClientUrls = splitCsv(process.env.CLIENT_URL);
const clientUrl =
  nodeEnv === 'production'
    ? configuredClientUrls.join(',') || 'http://localhost:5173'
    : Array.from(new Set([...defaultLocalClientUrls, ...configuredClientUrls])).join(',');

export const env = {
  nodeEnv,
  host: process.env.HOST || '0.0.0.0',
  // Hostinger typically proxies to PORT 3000; default to 3000 when not set.
  port: Number(process.env.PORT || 3000),
  mongoUri:
    readConfiguredValue(process.env.MONGODB_URI, ['your_db_user', 'your_db_password', 'your_cluster']) ||
    'mongodb://127.0.0.1:27017/tricore-events',
  mongoAllowMemoryFallback: process.env.MONGODB_ALLOW_MEMORY_FALLBACK === 'true',
  mongoServerSelectionTimeoutMs: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000),
  jwtSecret: readConfiguredValue(process.env.JWT_SECRET, ['replace_with_']) || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl,
  googleClientId: googleClientIds[0] || '',
  googleClientIds,
  contactForwardEmails: splitCsv(process.env.CONTACT_FORWARD_EMAILS),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFromEmail: process.env.SMTP_FROM_EMAIL || '',
  smtpFromName: process.env.SMTP_FROM_NAME || 'TriCore Events',
  smtpToRecipients: splitCsv(process.env.SMTP_TO_RECIPIENTS),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || ''
};
