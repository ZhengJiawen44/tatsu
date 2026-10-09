import { createDAVClient } from "tsdav";
import { CalDavCredentials } from "./types";
export const googleBasicAuthStrategy = {
  async execute(credentials: CalDavCredentials) {
    if(!credentials.refreshToken || !credentials.username) {
      throw new Error("Username and password are required for google basic auth");
    }
    const client = await createDAVClient({
      serverUrl: credentials.serverUrl || "https://apidata.googleusercontent.com/caldav/v2/",
      credentials: {
        username: credentials.username,
        refreshToken: credentials.refreshToken,
        tokenUrl: "https://oauth2.googleapis.com/token",
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      },
      authMethod: "Oauth",
      defaultAccountType: "caldav",
    });
    return client;
  },
};
