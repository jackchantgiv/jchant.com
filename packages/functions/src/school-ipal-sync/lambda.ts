import SchoolIpalClient from "@jchantcom/core/ipal-client";
import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: "calendarweathercleanup@jackchant81.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCex1135BiIef6K\n8MtBs9gDhlb3sqS2oJjO2vcCXxFxjnzb/Cd8elxov/KFqbysNH6HHt4CZw6F02zX\nduOVJgqHCrKlMG7AOmMsgGA91N+f/fj8GEkBF2T4axxosb5kpNkoZy1M0eeYBXH6\njLau/l9v11LQZ3dzyiuERB5OmJI4q/1QB7oD8YZaK5Dct9YBTyQxAM481VG8HutE\nApWtpN7vmz/9X8gsF1cEcydO7wnp01/X4j4mVs4tXXJ6cr5yITJkjyMcwdXbq5M7\nus0CYQgq5MciiTc0kXUb1RoxmCTI5h3inRkwJoQMaMgy5iMtcy+Vpky8MNldtzgT\nc6Obf7wTAgMBAAECggEAQTu8iYzTjYK9kvziLTDD35LaeTLSnFu33Ei28ij35DU7\n1C+xU2F8ROcTr1mws/lvQHlskgUgQNg/3/gvAXCbI6dABUE0R1LVuwtVPyIN7FAu\ncvhRShr/91YeWl8oT3Yw5/oX8PdOVLVsAhm81oGY2TzYf9n6iD54CYPpBbaGYLSW\nm7sWeN/RvrTYrFQ0V+QGLovDqrk4pXVdbVyes5zfBzGiGxocErTU5GJ+M/ARt84P\nioHLI5+XFHkcLhGPdoSeoTsyuX5yKZug8D4N3Y8RGS37eSVfVEChtP0t34ZanCfy\nFxhj3BRpWeH5mJiuLp11iIPFoyNEvHAu34sJJYei8QKBgQDZr/oiNZ+3+2xnqoLj\nDXygThhtD+8IYiYjaYSbc9YDyp0mfpFxRoOsVecSaWL5fFwgrK7ctwOHWN5jC5st\n6zcqwC8b9cOtMNTYH+uQCluLfEQLdVn+sERDO1aMSfn2cQDCV71z0fCVijPGNkP1\ndNiEhnxZjO8LaA2aBzu7XXyy0QKBgQC6uTpINmNjt5EinXgjb6W20Yra3Ck9uMha\nrdHUhBiLU5y0VyvKA2Exr0B5tl872vQ6JeWgB5p7l7Ab8E00BpQH+e1bFaibYJ5p\nV++3Kmm4e7t3pI/7JLAEttGAPX+5/hmLCHrwz+CpkfQYEpWN8O5pJulG6keLK7NP\n8cc+ZBoRowKBgHQlb4lHITPR4xIgqPsqG/+QC3pNURUhAQZN62Hh2SNmvJhoWYOd\nwu11W/e34QYKM0F/wUCkKS7S3Lzt2VsTr/iQV9JMO54xeq7hwRa2YAe5Qrj2YREB\nzTot88ygP80cl/IZTEz6i6nN9jfghjv1nvx+oORKzNRCLVesWlNq2vixAoGBAKWV\nPrbs7ERwc9cTd4dNKdIujgk5daUTaTDotYvUvINJWUyfhOh3CMjrlayZamiE6VFr\na+727yqswHJ2LbB2KO3N14uPcF6hVrkqTxzKEsiTiRI3L6tRxHnZuX0UjGDekb42\nffdxENSu5pw2VsNxpao/5FyLw3gJ/9BkIwET+f4rAoGAE1Vq1lqQYiV8C3iWflxZ\nZTdkrLhtzc/vhuDawnndWrOgjKPQxn2kO8hsy3JGkc5AnzE6s8laTtULX+yY/gwC\nZn+oyAECMhwUYfnCaSb/v1ApP182//dZtqjIBhcIz6CKJwv606a3yCJZeSn4A4MI\n2xQDicSD2Hfix1VRHtq8xWE=\n-----END PRIVATE KEY-----\n",
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

export async function main() {
  const ipalClient = new SchoolIpalClient({
    host: "https://outdoorfunltd.schoolipal.co.uk/",
    login: "jackchant81@gmail.com",
    password: "cfh1DGF5gnx-bma9fgr",
    validateSslCertificate: false,
  });

  const events = await calendar.events.list({
    calendarId: "jackchant81@gmail.com",
    timeMin: new Date().toISOString(),
    maxResults: 1000,
    singleEvents: false, // collapse recurring events
    orderBy: "updated",
    sharedExtendedProperty: ["type=kids-club"],
  });

  let rawEventData = await ipalClient.getEventData();

  // Parse events
  for (let e of rawEventData) {
    let ukDate = e.date.toString().substring(6).trim();
    e.dateObj = new Date(
      Number(ukDate.split("-")[2]),
      Number(ukDate.split("-")[1]) - 1,
      Number(ukDate.split("-")[0]),
    );
    if (e.title.toString().includes("Breakfast Club")) {
      e.type = "B";
    } else if (
      e.title.toString().includes("After School Club") &&
      e.variant.toString().includes("3pm")
    ) {
      e.type = "A1";
    } else if (
      e.title.toString().includes("After School Club") &&
      e.variant.toString().includes("4pm")
    ) {
      e.type = "A2";
    }

    e.key = `${e.dateObj.toLocaleDateString()}-${e.type}`;
  }

  // Filter out records before today
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  rawEventData = rawEventData.filter((e) => e.dateObj >= now);

  // Remove calendar entries that are not present anymore
  const toRemove = (events.data.items ?? []).filter(
    (ce) =>
      !rawEventData
        .map((e) => e.key)
        .includes(ce.extendedProperties?.shared?.kidsclubkey),
  );
  for (const calEntry of toRemove) {
    console.log("Removing", calEntry);
    await calendar.events.delete({
      calendarId: "jackchant81@gmail.com",
      eventId: calEntry.id ?? undefined,
    });
  }

  // Find New Entries
  const toAdd = rawEventData.filter(
    (e) =>
      !(events.data.items ?? [])
        .map((ce) => ce.extendedProperties?.shared?.kidsclubkey)
        .includes(e.key),
  );
  for (const eventToAdd of toAdd) {
    console.log("Adding", eventToAdd);
    let summary = "";
    let startDateTime: Date = new Date(eventToAdd.dateObj);
    let endDateTime: Date = new Date(eventToAdd.dateObj);
    if (eventToAdd.type === "B") {
      summary = "Drop off for Breakfast Club";
      startDateTime.setTime(startDateTime.getTime() + 7 * 60 * 60 * 1000);
      endDateTime.setTime(endDateTime.getTime() + 8 * 60 * 60 * 1000);
    } else if (eventToAdd.type === "A1") {
      summary = "Pick Up for After School Club (3pm-5.30pm)";
      startDateTime.setTime(
        startDateTime.getTime() + 16 * 60 * 60 * 1000 + 30 * 60 * 1000,
      );
      endDateTime.setTime(endDateTime.getTime() + 18 * 60 * 60 * 1000);
    } else if (eventToAdd.type === "A2") {
      summary = "Pick Up for 4pm After School Club (4pm-5.30pm)";
      startDateTime.setTime(
        startDateTime.getTime() + 16 * 60 * 60 * 1000 + 30 * 60 * 1000,
      );
      endDateTime.setTime(endDateTime.getTime() + 18 * 60 * 60 * 1000);
    }

    await calendar.events.insert({
      calendarId: "jackchant81@gmail.com",
      requestBody: {
        summary: summary,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Europe/London",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Europe/London",
        },
        extendedProperties: {
          shared: {
            type: "kids-club",
            kidsclubkey: eventToAdd.key,
          },
        },
      },
    });
  }
}
