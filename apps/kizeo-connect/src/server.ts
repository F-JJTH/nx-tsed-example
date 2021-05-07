import { Configuration, GlobalProviders, Inject, InjectorService } from '@tsed/di';
import { Constant, PlatformApplication } from '@tsed/common';
import '@tsed/platform-express'; // /!\ keep this import
import * as bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import '@tsed/ajv';
import '@tsed/swagger';
import '@tsed/mongoose';
import { config, rootDir } from './config';
import { IndexCtrl } from './app/controllers/pages/index.controller';
import { FileSyncAdapter } from '@tsed/adapters';
import { OidcSecureMiddleware } from '@tsed/oidc-provider';
import { InteractionsCtrl } from './app/controllers/oidc/InteractionsCtrl';
import { join } from 'path';
import { environment } from './environments/environment';
import { Env } from '@tsed/core';

@Configuration({
  ...config,
  ...environment,
  acceptMimes: ['application/json'],
  adapters: {
    lowdbDir: join(rootDir, '.db'),
    Adapter: FileSyncAdapter
  },
  mount: {
    //https://localhost:8080/oidc/auth?client_id=kizeo&response_type=id_token&scope=openid&nonce=foobar&redirect_uri=https://localhost:8080
    //"/rest": [`${rootDir}/controllers/**/*.ts`],
    '/rest': [],
    //"/oidc": [InteractionsCtrl],
    '/': [InteractionsCtrl, IndexCtrl]
  },
  swagger: [
    {
      path: '/v3/docs',
      specVersion: '3.0.1'
    }
  ],
  views: {
    root: `${rootDir}/assets/views`,
    viewEngine: 'ejs'
  },
  exclude: [
    '**/*.spec.ts'
  ]
})
export class Server {
  @Constant("env")
  env: Env;

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

    if (this.env === Env.PROD) {
      this.app.use(OidcSecureMiddleware); // ensure the https protocol
    }
  }
  $onReady(): void {

  }
}