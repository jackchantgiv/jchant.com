import { SSTConfig } from "sst";
import { CalendarWeatherCleanupStack } from "./stacks/CalendarWeatherCleanupStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { GitKitControllerStack } from "./stacks/GivKitControllerStack";

export default {
  config(_input) {
    return {
      name: "jchantcom",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app
      .stack(CalendarWeatherCleanupStack)
      .stack(GitKitControllerStack)
      .stack(FrontendStack);
  },
} satisfies SSTConfig;
