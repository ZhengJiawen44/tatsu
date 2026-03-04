import { createDAVClient } from "tsdav";

export const davicalBasicAuthStrategy = {
  async execute(username: string, password: string, serverUrl?: string) {
    const client = await createDAVClient({
      serverUrl: serverUrl || "http://localhost:8080/caldav.php/zhengjiawen/",
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
