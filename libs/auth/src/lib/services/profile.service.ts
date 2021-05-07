import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';


/**
 * Service used to manage OIDC
 */
@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    /**
     * Shared user identity claims
     */
    public claims;

    public userProfile;

    /**
     * Function used to init after OIDC
     */
    public initCallback: Function;

    /**
     * Constructor
     *
     * @param oauthService OIDC Service
     * @param router Angular router service
     */
    constructor(private oauthService: OAuthService, private router: Router) {
        const claims = this.oauthService.getIdentityClaims();
        if (claims) {
            this.claims = claims;
        }

        this.oauthService.events.subscribe(data => {
            if (data.type === 'token_received') {
                this.oauthService.loadUserProfile().then(async () => {
                    this.userProfile = await this.oauthService.loadUserProfile();
                    this.claims = this.oauthService.getIdentityClaims();

                    //this.appInsightsService.setAuthenticatedUserContext(this.claims.sub);

                    if (this.initCallback) {
                        this.initCallback();
                    }

                    console.debug('state', this.oauthService.state);
                    this.router.navigateByUrl(this.oauthService.state);
                });
            }
        });
    }

    /**
     * Configure OIDC
     *
     * @param authConfig AuthConfig define in external package
     */
    public configureWithNewConfigApi(authConfig: AuthConfig) {
        this.oauthService.configure(authConfig);
        this.oauthService.loadDiscoveryDocumentAndLogin();
    }
}
