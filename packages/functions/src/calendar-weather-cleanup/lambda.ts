import {google} from "googleapis";

/**
 * Looks for events in my calendar that display weather information and deletes them!
 */
export async function main() {
    const auth = new google.auth.JWT({
        email: "calendarweathercleanup@jackchant81.iam.gserviceaccount.com",
        key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCex1135BiIef6K\n8MtBs9gDhlb3sqS2oJjO2vcCXxFxjnzb/Cd8elxov/KFqbysNH6HHt4CZw6F02zX\nduOVJgqHCrKlMG7AOmMsgGA91N+f/fj8GEkBF2T4axxosb5kpNkoZy1M0eeYBXH6\njLau/l9v11LQZ3dzyiuERB5OmJI4q/1QB7oD8YZaK5Dct9YBTyQxAM481VG8HutE\nApWtpN7vmz/9X8gsF1cEcydO7wnp01/X4j4mVs4tXXJ6cr5yITJkjyMcwdXbq5M7\nus0CYQgq5MciiTc0kXUb1RoxmCTI5h3inRkwJoQMaMgy5iMtcy+Vpky8MNldtzgT\nc6Obf7wTAgMBAAECggEAQTu8iYzTjYK9kvziLTDD35LaeTLSnFu33Ei28ij35DU7\n1C+xU2F8ROcTr1mws/lvQHlskgUgQNg/3/gvAXCbI6dABUE0R1LVuwtVPyIN7FAu\ncvhRShr/91YeWl8oT3Yw5/oX8PdOVLVsAhm81oGY2TzYf9n6iD54CYPpBbaGYLSW\nm7sWeN/RvrTYrFQ0V+QGLovDqrk4pXVdbVyes5zfBzGiGxocErTU5GJ+M/ARt84P\nioHLI5+XFHkcLhGPdoSeoTsyuX5yKZug8D4N3Y8RGS37eSVfVEChtP0t34ZanCfy\nFxhj3BRpWeH5mJiuLp11iIPFoyNEvHAu34sJJYei8QKBgQDZr/oiNZ+3+2xnqoLj\nDXygThhtD+8IYiYjaYSbc9YDyp0mfpFxRoOsVecSaWL5fFwgrK7ctwOHWN5jC5st\n6zcqwC8b9cOtMNTYH+uQCluLfEQLdVn+sERDO1aMSfn2cQDCV71z0fCVijPGNkP1\ndNiEhnxZjO8LaA2aBzu7XXyy0QKBgQC6uTpINmNjt5EinXgjb6W20Yra3Ck9uMha\nrdHUhBiLU5y0VyvKA2Exr0B5tl872vQ6JeWgB5p7l7Ab8E00BpQH+e1bFaibYJ5p\nV++3Kmm4e7t3pI/7JLAEttGAPX+5/hmLCHrwz+CpkfQYEpWN8O5pJulG6keLK7NP\n8cc+ZBoRowKBgHQlb4lHITPR4xIgqPsqG/+QC3pNURUhAQZN62Hh2SNmvJhoWYOd\nwu11W/e34QYKM0F/wUCkKS7S3Lzt2VsTr/iQV9JMO54xeq7hwRa2YAe5Qrj2YREB\nzTot88ygP80cl/IZTEz6i6nN9jfghjv1nvx+oORKzNRCLVesWlNq2vixAoGBAKWV\nPrbs7ERwc9cTd4dNKdIujgk5daUTaTDotYvUvINJWUyfhOh3CMjrlayZamiE6VFr\na+727yqswHJ2LbB2KO3N14uPcF6hVrkqTxzKEsiTiRI3L6tRxHnZuX0UjGDekb42\nffdxENSu5pw2VsNxpao/5FyLw3gJ/9BkIwET+f4rAoGAE1Vq1lqQYiV8C3iWflxZ\nZTdkrLhtzc/vhuDawnndWrOgjKPQxn2kO8hsy3JGkc5AnzE6s8laTtULX+yY/gwC\nZn+oyAECMhwUYfnCaSb/v1ApP182//dZtqjIBhcIz6CKJwv606a3yCJZeSn4A4MI\n2xQDicSD2Hfix1VRHtq8xWE=\n-----END PRIVATE KEY-----\n",
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({
        version: "v3",
        auth,
    });

    const events = await calendar.events.list({
        calendarId: "jackchant81@gmail.com",
        timeMin: new Date().toISOString(),
        maxResults: 250,
        singleEvents: false, // collapse recurring events
        orderBy: "updated",
    });

    for (const toDeleteElement of (events.data.items ?? [])) {
        console.log("Event:", toDeleteElement.summary);
        if (toDeleteElement.id && toDeleteElement.summary && toDeleteElement.summary.indexOf("°F") > -1 && toDeleteElement.summary.indexOf("°C") > -1) {
            console.log("DELETING CALENDAR ENTRY!");
            await calendar.events.delete({
                calendarId: "jackchant81@gmail.com",
                eventId: toDeleteElement.id
            })
        }
    }

    return {};
}
