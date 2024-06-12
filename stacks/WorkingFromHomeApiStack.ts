import {StackContext, Api} from "sst/constructs";

export function WorkingFromHomeApiStack({stack, app}: StackContext) {
    const api = new Api(stack, "api", {
        routes: {
            "GET /wfh": "packages/functions/src/working-from-home/calendar-fetch.handler",
        },
        customDomain: app.stage === "prod" ? {
            domainName: "api.jchant.com",
        } : undefined,
    });

    stack.addOutputs({
        ApiEndpoint: api.customDomainUrl || api.url,
    });

    return {
        api,
        apiUrl: api.customDomainUrl || api.url
    };
}