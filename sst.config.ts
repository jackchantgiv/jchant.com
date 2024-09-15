import { SSTConfig } from "sst";
import { CalendarWeatherCleanupStack } from "./stacks/CalendarWeatherCleanupStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { GitKitControllerStack } from "./stacks/GivKitControllerStack";
import { SchoolIpalSyncStack } from "./stacks/SchoolIpalSyncStack";

export default {
  config(_input) {
    return {
      name: "jchantcom",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      logRetention: "one_week",
    });

    app
      .stack(CalendarWeatherCleanupStack)
      .stack(GitKitControllerStack)
      .stack(FrontendStack)
      .stack(SchoolIpalSyncStack);
  },
} satisfies SSTConfig;
