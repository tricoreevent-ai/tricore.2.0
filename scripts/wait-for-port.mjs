import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../server/.env')
});

const normalizeConnectHost = (value) => {
  const host = String(value || '').trim();

  if (!host || host === '0.0.0.0' || host === '::' || host === '::0') {
    return 'localhost';
  }

  return host;
};

const host = normalizeConnectHost(process.argv[2] || process.env.WAIT_FOR_PORT_HOST || process.env.HOST);
const port = Number.parseInt(process.argv[3] || process.env.WAIT_FOR_PORT_PORT || process.env.PORT || '5000', 10);
const timeoutMs = Number.parseInt(process.argv[4] || '30000', 10);
const startedAt = Date.now();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canConnect = () =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });

while (Date.now() - startedAt < timeoutMs) {
  if (await canConnect()) {
    process.exit(0);
  }

  await sleep(250);
}

console.error(`Timed out waiting for ${host}:${port} after ${timeoutMs}ms.`);
process.exit(1);
