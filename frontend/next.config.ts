import { createCivicAuthPlugin } from "@civic/auth/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  reactStrictMode: true,
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "50b030c3-fac2-4832-9020-f0d7476fce83",
  // oauthServer is not necessary for production.
  //oauthServer: process.env.AUTH_SERVER || 'https://auth.civic.com/oauth',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Set the loginSuccessUrl to send your users to a specific route after login. If not set, users will go to the root of your app.
  // This example app has a custom success route at /customSuccessRoute.
  //loginSuccessUrl: process.env.LOGIN_SUCCESS_URL,
});

export default withCivicAuth(nextConfig)