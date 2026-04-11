import fs from 'node:fs';
import path from 'node:path';

const ENV_FILE_CANDIDATES = [
  // The backend's canonical local config lives in server/.env.
  path.join('server', '.env'),
  path.join('server', 'env'),
  '.env',
  'env'
];

export const getEnvFileCandidates = (rootDir) =>
  ENV_FILE_CANDIDATES.map((relativePath) => path.resolve(rootDir, relativePath));

export const resolveEnvFilePath = (rootDir) =>
  getEnvFileCandidates(rootDir).find((candidatePath) => fs.existsSync(candidatePath)) || null;

export const getExistingEnvFilePaths = (rootDir) =>
  getEnvFileCandidates(rootDir).filter((candidatePath) => fs.existsSync(candidatePath));
