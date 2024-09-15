import { Cron, StackContext } from "sst/constructs";

export function SchoolIpalSyncStack({ stack, app }: StackContext) {
  const c = new Cron(stack, "SchoolIpalSyncCron", {
    schedule: "rate(60 minutes)",
    job: {
      handler: "packages/functions/src/school-ipal-sync/lambda.main",
      timeout: 120,
    },
  });
}
