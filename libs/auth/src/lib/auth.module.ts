import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileService } from './services/profile.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AUTH_CONFIG } from './auth.token';

@NgModule({
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
  ],
})
export class AuthModule {
  /**
     * Constructor
     *
     * @param parentModule Parent module if exists
     */
   public constructor(@Optional() @SkipSelf() parentModule: AuthModule, profileService: ProfileService, @Inject(AUTH_CONFIG) authConfig: AuthConfig) {
    if (!parentModule) {
        profileService.configureWithNewConfigApi(authConfig);
    }
}

/**
 * Use to import in root module
 *
 * @param config NgxCore config
 */
public static forRoot(authConfig: AuthConfig): ModuleWithProviders<AuthModule>  {
    return {
        ngModule: AuthModule,
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
          { provide: AUTH_CONFIG, useValue: authConfig },
          // AppInsightsService,
          // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
          // { provide: ErrorHandler, useClass: ErrorHandlerService },
          // { provide: PRODUCTION, useValue: config.production },
          // { provide: NOTIFICATION_CONFIG, useValue: config.notification },
        ]
    };
}
}
