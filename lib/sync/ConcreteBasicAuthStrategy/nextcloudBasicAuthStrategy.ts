import { createDAVClient } from "tsdav";
import { CalDavAuthStrategy, CalDavCredentials } from "./types";

export const nextcloudBasicAuthStrategy: CalDavAuthStrategy = {
  async execute(credentials: CalDavCredentials) {
    if (!credentials.username || !credentials.password)
      throw new Error(
        "Username and password are required for next cloud basic auth",
      );
    const client = await createDAVClient({
      serverUrl:
        credentials.serverUrl || "http://localhost:8082/remote.php/dav/",
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
