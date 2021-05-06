export const environment = {
  production: false,
  httpPort: 8070,
  httpsOptions: {
    port: 8080,
    keyPath: "/home/cdelhamaide/projects/kizeo/nx/kizeo/apps/kizeo-connect/certificates/localhost-key.pem",
    certPath: "/home/cdelhamaide/projects/kizeo/nx/kizeo/apps/kizeo-connect/certificates/localhost.pem",
  },
  oidc: {
    jwksPath: "/home/cdelhamaide/projects/kizeo/nx/kizeo/apps/kizeo-connect/keys/jwks.json",
  }
};
