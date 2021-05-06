import { Configuration, Inject, Constant, InjectorService, GlobalProviders } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import * as bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import { config, rootDir } from "../config";
import { IndexCtrl } from "./controllers/pages/index.controller";
import { FileSyncAdapter } from "@tsed/adapters";
import { OidcSecureMiddleware } from "@tsed/oidc-provider";
import "@tsed/ajv";
import "@tsed/swagger";
import { Accounts } from "./services/Accounts";
import { InteractionsCtrl } from "./controllers/oidc/InteractionsCtrl";
import { KoaContextWithOIDC } from "oidc-provider";
import { join } from "path";
import * as fs from "fs";
import { environment } from "../environments/environment";

const configuration: any = {
  ...config,
  acceptMimes: ["application/json"],
  httpPort: environment.httpPort,
  httpsPort: environment.httpsOptions.port,
  httpsOptions: {
    key:  fs.readFileSync(environment.httpsOptions.keyPath),
    cert: fs.readFileSync(environment.httpsOptions.certPath),
  },
  adapters: {
    lowdbDir: join(rootDir, ".db"),
    Adapter: FileSyncAdapter
  },
  mount: {
    //https://localhost:8080/oidc/auth?client_id=kizeo&response_type=id_token&scope=openid&nonce=foobar&redirect_uri=https://localhost:8080
    //"/rest": [`${rootDir}/controllers/**/*.ts`],
    "/rest": [],
    //"/oidc": [InteractionsCtrl],
    "/": [InteractionsCtrl, IndexCtrl]
  },
  oidc: {
    issuer: "https://localhost:8080",
    jwksPath: environment.oidc.jwksPath,
    Accounts: Accounts, // Injectable service to manage your accounts
    clients: [ // statics clients
      {
        client_id: "kizeo_forms",
        application_type: "web",
        client_secret: "client_secret",
        redirect_uris: [
          "https://localhost:8080",
          "http://localhost:4200/login-callback",
        ],
        response_types: ["code", "id_token"],
        grant_types: ["implicit", "authorization_code", "refresh_token"],
        token_endpoint_auth_method: "none",
      },
      {
        client_id: "kizeo_tempo",
        application_type: "web",
        client_secret: "client_secret",
        redirect_uris: [
          "https://localhost:8080",
          "http://localhost:4200/login-callback",
        ],
        response_types: ["code", "id_token"],
        grant_types: ["implicit", "authorization_code", "refresh_token"],
        token_endpoint_auth_method: "none",
      }
    ],
    async loadExistingGrant(ctx: KoaContextWithOIDC) {
      const grantId = (ctx.oidc.result
        && ctx.oidc.result.consent
        && ctx.oidc.result.consent.grantId) || ctx.oidc.session?.grantIdFor(ctx.oidc.client?.clientId || '');

      if (grantId) {
        return ctx.oidc.provider.Grant.find(grantId);
      } else {
        const grant = new ctx.oidc.provider.Grant();
        grant.accountId = ctx.oidc.session?.accountId
        grant.clientId = ctx.oidc.client?.clientId

        grant.addOIDCScope('openid email profile');
        grant.addOIDCClaims(['firstname']);
        grant.addResourceScope('urn:kizeo:tempo', 'api:read api:write');
        grant.addResourceScope('urn:kizeo:forms', 'api:read api:write');
        await grant.save();
        return grant;
      }
    },
    claims: {
      openid: ["sub"],
      email: ["email", "email_verified"],
      profile: ["firstname", "lastname"]
    },
    /*routes: {
      authorization: "/oidc/auth",
    },*/
    //formats: { AccessToken: "jwt" },
    features: {
      // disable the packaged interactions
      devInteractions: { enabled: true },
      encryption: { enabled: true },
      introspection: { enabled: true },
      revocation: { enabled: true },
      userinfo: { enabled: true },
      jwtUserinfo: { enabled: true },
    },
  },
  swagger: [
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ],
  views: {
    root: `${rootDir}/assets/views`,
    viewEngine: "ejs"
  },
  exclude: [
    "**/*.spec.ts"
  ]
}

//console.log(configuration)
@Configuration(configuration)
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;
  
  @Inject()
  injector: InjectorService;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

    if (environment.production) {
      this.app.use(OidcSecureMiddleware) // ensure the https protocol
    }
  }

  $onReady(): void {
    console.log(GlobalProviders.keys())
    console.log(this.injector.getProviders())
  }
}
