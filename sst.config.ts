import {SSTConfig} from "sst";
import {CalendarWeatherCleanupStack} from "./stacks/CalendarWeatherCleanupStack";
import {FrontendStack} from "./stacks/FrontendStack";

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
            .stack(FrontendStack);
    },
} satisfies SSTConfig;
