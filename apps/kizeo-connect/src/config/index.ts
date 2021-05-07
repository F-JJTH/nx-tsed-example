import { join } from "path";
import { loggerConfig } from "./logger";
import mongooseConfig from "./mongoose";
import { oidcConfig } from './oidc';
import { environment } from '../environments/environment';

const version = "1.0.0";

export const rootDir = join(__dirname, "..", "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  mongoose: mongooseConfig,
  oidc: {
    ...environment.oidc || {},
    ...oidcConfig
  },
  // additional shared configuration
};
