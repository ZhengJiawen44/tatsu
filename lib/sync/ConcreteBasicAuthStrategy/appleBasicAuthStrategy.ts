import { createDAVClient } from "tsdav";
import { CalDavAuthStrategy, CalDavCredentials } from "./types";

export const appleBasicAuthStrategy: CalDavAuthStrategy = {
  async execute(credentials: CalDavCredentials) {
    if(!credentials.username || !credentials.password) {
      throw new Error("Username and password are required for apple basic auth");
    }
    const client = await createDAVClient({
      serverUrl: credentials.serverUrl || "https://caldav.icloud.com",
      credentials: {
        username: credentials.username,
        password: credentials.password,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });
    return client;
  },
};
