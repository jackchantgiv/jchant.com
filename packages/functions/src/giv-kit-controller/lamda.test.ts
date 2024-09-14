import {test} from "vitest";
import {main} from "./lambda";

test("Lowest tier", async () => {
    await main();
});
