import { Cron, StackContext } from "sst/constructs";

export function CalendarWeatherCleanupStack({ stack, app }: StackContext) {
  if (app.stage === "prod") {
    new Cron(stack, "CalendarWeatherCleanupCron", {
      schedule: "cron(*/15 4-9 * * ? *)", // use 'rate(1 minute)' for testing
      job: "packages/functions/src/calendar-weather-cleanup/lambda.main",
    });
  }
}
