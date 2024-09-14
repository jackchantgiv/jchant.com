import { Index } from "@jchantcom/core/givclient";

const givToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTc3MDIxOS1jYWE2LTRmOTctOTE3Ni0zNDBlZGMzZDQxNTgiLCJqdGkiOiI3OTVmM2YwYWI5YTc1MzcyZDQwYTUxMTZjNmY5ZmE5YzcwNTFlNWJiYzBlZjczOGQyZTgyZDU2MmI4NmU5YzllODRhNjVjNGUxMzI3ZGU3NyIsImlhdCI6MTcyNjI1NjcxMy43MzAyOTQsIm5iZiI6MTcyNjI1NjcxMy43MzAyOTcsImV4cCI6MzI1MDM2ODAwMDAuMDE4NTY2LCJzdWIiOiI3NzUzMSIsInNjb3BlcyI6WyJhcGkiXX0.mFbUJA4_9EUc_Vb2iPPFNSiBUPGZte7Gbe0yjY3XDkIa07M-eCZi3EfJXo0wcHg-aXBY5F5BQIqKiig_ltvTuESHj923rkcrHMXADcG9X9qYxy92Spd8kwEj0SYNoRC6nXQoE3SezkjDWO0G6Qh_-_3HWZD6Gyl4u204H1xzUUOXdaVdviLlQaQKme8NT2YwqJwxugoA38UQbkVjmpw4D0klasSxfDxlrTQn1X68LT41CVZ1SSfRH9D59VdxYxFUZ30I0Z8n0XHHZVjz0ZvXCBirUYgDM9z2a5R7zdWnWmhvu3DR_XecaxXXV9uWsARmq55rzESflh1YLHm--OOcEAnBW24XpWlJpxIgO1nFy-EJa-Rdc6dx3cWQQJiNvl1jWCwGk-ZiAWKUNUfpZSiyEkCdIwhs9C9GQFUsrhZQveGbG4Buu9NvLYEts9qtAa3Qix0caLZBD-moaygOtLNg0taNO0ALhvnl3KlD0R2W3dxhm56_Fjuxl-_mwl-UoVwnbwctKg28Pc0dcz_3Sxdw5GezSXZFTWxq_jtmkm78TDu-VFlzKbrMmxSfhAWNEwxobatxk7F4hp9onsXbNz9rZj3Mw9k928SB6xV1xvG_yM_kkzvtCAnxIdu0ohZCPQHh5gD56aCrSSsIgR8CdsLYEVj9pSHchl_5gtbNseCJLhM";
const inverterSerial = "CH2315G355";
export async function main() {
  const givClient = new Index(givToken);

  const evChargers = await givClient.readEvChargers();
  const currentEcoMode = await givClient.readEcoMode(inverterSerial);
  // See if any chargers on this account are charging
  const evCharging = evChargers.some((ev) => ev.status === "Charging");

  console.log("currentEcoMode", currentEcoMode);
  console.log("evCharging", evCharging);

  if (currentEcoMode && evCharging) {
    console.log("Disabling Eco Mode");
    await givClient.updateEcoMode(inverterSerial, false);
    await givClient.sendGivNotification({
      platforms: ["push"],
      title: "Preventing Battery Discharge to Car",
      body: "Detected car charging and battery in Eco - disabling Eco Mode",
      icon: "mdi-account-outline",
    });
  } else if (!currentEcoMode && !evCharging) {
    console.log("Enabling Eco Mode");
    await givClient.updateEcoMode(inverterSerial, true);
    await givClient.sendGivNotification({
      platforms: ["push"],
      title: "Enabling Eco Mode",
      body: "Detected Eco off with no charging - enabling Eco Mode",
      icon: "mdi-account-outline",
    });
  } else {
    console.log("All Good");
  }
}
