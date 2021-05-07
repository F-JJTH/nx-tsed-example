import { Env } from '@tsed/core';
import { join } from 'path';
import * as fs from 'fs';

const rootDir = process.env.NX_WORKSPACE_ROOT ? join(__dirname, "..") : join(__dirname, "../..");

export const environment: Partial<TsED.Configuration> = {
  env: Env.DEV,
  httpPort: 8070 || process.env.HTTP_PORT,
  httpsPort: 8080 || process.env.HTTPS_PORT,
  httpsOptions: {
    key: fs.readFileSync(String(join(rootDir, "certificates/localhost-key.pem") || process.env.CERT_KEY_PATH)),
    cert: fs.readFileSync(String(join(rootDir, "certificates/localhost.pem") || process.env.CERT_PATH)),
  } as any,
  oidc: {
    jwksPath: join(rootDir, "keys/jwks.json") || process.env.JWKS_PATH,
  }
};
