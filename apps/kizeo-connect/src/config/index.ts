import { join } from "path";
import { environment } from "../environments/environment";
import { loggerConfig } from "./logger";
import mongooseConfig from "./mongoose";
import { oidcConfig } from "./oidc";

const version = "1.0.0";
export const rootDir = join(__dirname, "..", "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  mongoose: mongooseConfig,
  ...environment,
  oidc: {
    ...environment.oidc || {},
    ...oidcConfig,
  },
};
