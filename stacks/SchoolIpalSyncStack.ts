import { Cron, StackContext, Function } from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function SchoolIpalSyncStack({ stack, app }: StackContext) {
  const schooliPal = new Function(stack, "Function", {
    handler: "packages/functions/src/school-ipal-sync/lambda.main",
    timeout: 120,
    nodejs: {
      esbuild: {
        external: ["chrome-aws-lambda"],
      },
    },
    layers: [
      new lambda.LayerVersion(stack, "chrome-aws-lambda", {
        code: lambda.Code.fromAsset("layers/chrome-aws-lambda"),
      }),
    ],
  });

  // new Cron(stack, "SchoolIpalSyncCron", {
  //   schedule: "rate(60 minutes)",
  //   job: schooliPal,
  // });
}
