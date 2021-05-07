import { InjectionToken } from "@angular/core";
import { AuthConfig } from 'angular-oauth2-oidc';

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');