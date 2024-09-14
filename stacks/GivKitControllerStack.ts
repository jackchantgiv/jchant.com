import { Cron, StackContext } from "sst/constructs";

export function GitKitControllerStack({ stack, app }: StackContext) {
  if (app.stage === "prod") {
    new Cron(stack, "GitKitControllerCron", {
      schedule: "rate(1 minute)",
      job: "packages/functions/src/giv-kit-controller/lambda.main",
    });
  }
}
