export class OctoClient {
  private readonly _graphQlUrl = "https://api.octopus.energy/v1/graphql/";
  private readonly _apiToken: string;
  private readonly _accountNumber: string;
  private _graphQlToken: string = "";

  public constructor(apiToken: string, accountNumber: string) {
    this._apiToken = apiToken;
    this._accountNumber = accountNumber;
  }

  /**
   * Octo playground:
   * https://api.octopus.energy/v1/graphql/#query=query%20PlannedDispatches(%24accountNumber%3A%20String!)%20%7B%0A%20%20plannedDispatches(accountNumber%3A%20%24accountNumber)%20%7B%0A%20%20%20%20start%0A%20%20%20%20end%0A%20%20%20%20delta%0A%20%20%20%20meta%7B%20source%20%7D%0A%20%20%7D%0A%7D%0A&operationName=PlannedDispatches&variables=%7B%0A%20%20%22accountNumber%22%3A%20%22A-D767EA7D%22%0A%7D
   */
  public async getPlannedDispatches(): Promise<any> {
    return await this.performGraphQlQuery(
      `
      query PlannedDispatches($accountNumber: String!) {
        plannedDispatches(accountNumber: $accountNumber) {
          start
          end
          delta
          meta{ source }
        }
      }
    `,
      { accountNumber: this._accountNumber },
    );
  }

  private async performGraphQlQuery(
    query: string,
    variables: object,
  ): Promise<any> {
    // If no gql token yet we go create one
    if (!this._graphQlToken) {
      // Playground: https://api.octopus.energy/v1/graphql/#query=mutation%20ObtainKrakenToken(%24input%3A%20ObtainJSONWebTokenInput!)%20%7B%0A%20%20obtainKrakenToken(input%3A%20%24input)%20%7B%0A%20%20%20%20token%0A%20%20%7D%0A%7D&operationName=ObtainKrakenToken&variables=%7B%0A%20%20%22input%22%3A%20%7B%0A%20%20%22APIKey%22%3A%20%22sk_live_RfdkBMVJMCbXXGLKuS0POscB%22%0A%09%7D%0A%7D
      const tokenData = await this.performGraphQlQuery(
        `
          mutation ObtainKrakenToken($input: ObtainJSONWebTokenInput!) {
            obtainKrakenToken(input: $input) {
              token
            }
          }
        `,
        { input: { APIKey: this._apiToken } },
      );
      this._graphQlToken = tokenData.obtainKrakenToken.token;
    }

    const returnData = await fetch(this._graphQlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: this._graphQlToken ?? "",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const returnDataJson = (await returnData.json()) as any;

    if (returnDataJson.errors?.[0]?.message) {
      throw (
        "Exception calling Octopus API: " + returnDataJson.errors[0].message
      );
    }

    return returnDataJson.data;
  }
}
