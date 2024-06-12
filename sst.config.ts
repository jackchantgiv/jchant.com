import {SSTConfig} from "sst";
import {CalendarWeatherCleanupStack} from "./stacks/CalendarWeatherCleanupStack";
import {FrontendStack} from "./stacks/FrontendStack";
import {WorkingFromHomeApiStack} from "./stacks/WorkingFromHomeApiStack";

export default {
    config(_input) {
        return {
            name: "jchantcom",
            region: "eu-west-1",
        };
    },
    stacks(app) {
        app
            .stack(CalendarWeatherCleanupStack)
            .stack(WorkingFromHomeApiStack)
            .stack(FrontendStack);
    },
} satisfies SSTConfig;
