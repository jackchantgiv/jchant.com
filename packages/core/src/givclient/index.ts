export class Index {
  private _givApi = "https://api.givenergy.cloud/v1/";
  private readonly _apiToken: string;
  public constructor(apiToken: string) {
    this._apiToken = apiToken;
  }

  private async performRequest(urlSuffix: string, body?: object): Promise<any> {
    const retValue = await fetch(this._givApi + urlSuffix.trim(), {
      method: body ? "POST" : "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._apiToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (retValue.ok) {
      return ((await retValue.json()) as any)?.data;
    } else {
      throw "Exception calling GivApi: " + (await retValue.text());
    }
  }

  public async sendGivNotification(notificationBody: {
    /**
     * push: push notification to device
     * persist: into the GivApp notification area across all devices
     */
    platforms: ("push" | "persist")[];
    title: string;
    body: string;
    icon: string;
  }) {
    await this.performRequest("notification/send", notificationBody);
  }

  public async readEcoMode(inverterSerial: string): Promise<boolean> {
    const regValue = await this.performRequest(
      `inverter/${inverterSerial}/settings/24/read`,
      {},
    ); // Empty body to POST

    if (typeof regValue.value !== "boolean") {
      console.log("Unexpected value:", regValue);
      throw "Unexpected output from reading settings register: " + regValue;
    }

    return regValue.value;
  }
  public async updateEcoMode(inverterSerial: string, ecoMode: boolean) {
    await this.performRequest(`inverter/${inverterSerial}/settings/24/write`, {
      value: ecoMode,
    });
  }

  /**
   * Available	The EV charger is not plugged in to a vehicle
   * Preparing	The EV charger is plugged into a vehicle and is ready to start a charge
   * Charging	The EV charger is charging the connected EV
   * SuspendedEVSE	The charging session has been stopped by the EV charger
   * SuspendedEV	The charging session has been stopped by the EV
   * Finishing	The charging session has finished, but the EV charger isn't ready to start a new charging session
   * Reserved	The EV charger has been reserved for a future charging session
   * Unavailable	The EV charger cannot start new charging sessions
   * Faulted	The EV charger is reporting an error
   */
  public async readEvChargers(): Promise<
    {
      uuid: string;
      serial_number: string;
      type: string;
      alias: string | null;
      online: boolean;
      went_offline_at: string;
      status: string;
      power_now: {
        value: number;
        unit: "kW";
      };
    }[]
  > {
    return await this.performRequest(`ev-charger`);
  }
}
