import { StackContext, StaticSite, use } from "sst/constructs";

export function FrontendStack({ stack, app }: StackContext) {
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    customDomain:
      app.stage === "prod"
        ? {
            domainName: "jchant.com",
            domainAlias: "www.jchant.com",
          }
        : undefined,
    // Pass in our environment variables
    environment: {
      // VITE_API_URL: apiUrl,
      VITE_REGION: app.region,
      // VITE_BUCKET: bucket.bucketName,
      // VITE_USER_POOL_ID: auth.userPoolId,
      // VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      // VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
  });
}
