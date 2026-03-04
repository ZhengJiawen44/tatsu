import { createDAVClient } from "tsdav";

export const baikalBasicAuthStrategy = {
  async execute(username: string, password: string, serverUrl?: string) {
    const client = await createDAVClient({
      serverUrl: serverUrl || "http://localhost:8800/dav.php",
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
