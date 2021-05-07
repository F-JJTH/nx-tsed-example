import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { EMPTY, Observable } from 'rxjs';
import { AUTH_CONFIG } from '../auth.token';

/**
 * Used to add OIDC autorization bearer token
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    /**
     * Constructor
     *
     * @param router Angular router
     * @param oauthService OAuth service which token
     * @param oauthConfig OAuth config used to bypass oauth request
     */
    constructor(private router: Router, private oauthService: OAuthService, @Inject(AUTH_CONFIG) private oauthConfig: AuthConfig) { }

    /**
     * Intercept method
     *
     * @param request Http request
     * @param next Http handler
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (new RegExp('^' + this.oauthConfig.issuer).test(request.url)) {
            return next.handle(request);
        }

        const token = this.oauthService.getAccessToken();
        if (token) {
            if (Date.now() > this.oauthService.getAccessTokenExpiration()) {
                this.oauthService.initCodeFlow(this.router.routerState.snapshot.url || '/');

                return EMPTY;
            }

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}
