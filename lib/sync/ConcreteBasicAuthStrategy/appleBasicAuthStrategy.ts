import { createDAVClient } from "tsdav";

export const appleBasicAuthStrategy = {
  async execute(username: string, password: string, serverUrl?: string) {
    const client = await createDAVClient({
      serverUrl: serverUrl || "https://caldav.icloud.com",
      credentials: {
        username,
        password,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });
    return client;
  },
};
