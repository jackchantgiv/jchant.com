import { describe, test } from "vitest";
import { main } from "./lambda";

test(
  "School Ipal Sync",
  async () => {
    await main();
  },
  { timeout: 120000 },
);
