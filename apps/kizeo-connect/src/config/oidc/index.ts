import { Accounts } from '../../app/services/Accounts';
import { KoaContextWithOIDC } from 'oidc-provider';
import { OidcSettings } from '@tsed/oidc-provider';

export const oidcConfig: OidcSettings = {
  issuer: "https://localhost:8080",
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
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: true },
    encryption: { enabled: true },
    introspection: { enabled: true },
    revocation: { enabled: true },
    userinfo: { enabled: true },
    jwtUserinfo: { enabled: true },
  },
}