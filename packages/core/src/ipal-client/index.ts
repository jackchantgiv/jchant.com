import playwright from "playwright-aws-lambda";
export interface IpalEnvSettings {
  host: string;
  login: string;
  password: string;
  validateSslCertificate?: boolean;
}

/**
 * A client for accessing data on the GivEnergy Portal.
 * Handles logins and XSRF tokens.
 */
export default class SchoolIpalClient {
  constructor(public env: IpalEnvSettings) {}

  async getEventData(): Promise<any[]> {
    let browser = null;

    try {
      browser = await playwright.launchChromium({
        //headless: true,
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(5000);

      // Login page
      await page.goto(
        "https://outdoorfunltd.schoolipal.co.uk/parent/login_reg",
      );

      // Fill in login params and click login
      await page
        .getByPlaceholder("Enter your Email Address")
        .fill(this.env.login);
      await page.getByPlaceholder("Your Password").fill(this.env.password);
      await page.getByText("Login", { exact: true }).click();

      await page.goto(
        "https://outdoorfunltd.schoolipal.co.uk/parent/mycaledar",
      );

      let eventJson: any[] = [];

      await page.getByText("list").click();

      await page.locator("button[aria-label='prev']").click();
      await page.locator("button[aria-label='next']").click();

      await processPage();
      // await page.locator("button[aria-label='next']").click();
      // await processPage();
      // await page.locator("button[aria-label='next']").click();
      // await processPage();

      async function processPage() {
        let events = await page.locator("tr[class=fc-list-item]").all();
        for (const event of events) {
          await event.click();

          await page.waitForTimeout(2000);

          eventJson.push({
            date: (
              await page
                .locator(
                  "div[id=eventDetail] div[class=event_deatls_content] p",
                )
                .nth(1)
                .textContent()
            )?.trim(),
            title: (
              await page
                .locator("div[id=eventDetail] h4[class=modal-title]")
                .textContent()
            )?.trim(),
            variant: (
              await page
                .locator("div[id=eventDetail] tr")
                .nth(1)
                .locator("td")
                .nth(1)
                .textContent()
            )?.trim(),
            children: (
              await page
                .locator("div[id=eventDetail] tr")
                .nth(2)
                .locator("td")
                .nth(1)
                .textContent()
            )?.trim(),
          });

          await page
            .locator("div[id=eventDetail] button[aria-label='Close'] span")
            .click({ timeout: 3000 });
        }
      }

      return eventJson;
    } catch (error) {
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
