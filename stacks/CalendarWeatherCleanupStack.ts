import {Cron, StackContext} from "sst/constructs";

export function CalendarWeatherCleanupStack({stack, app}: StackContext) {
    new Cron(stack, "Cron", {
        schedule: app.stage === "prod" ? "cron(*/15 4-9 * * ? *)" : "rate(1 minute)",
        job: "packages/functions/src/calendar-weather-cleanup/lambda.main",
    });
}
