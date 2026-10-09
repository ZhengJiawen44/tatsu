import { createDAVClient } from "tsdav";
import { ConcreteBasicAuthStrategy } from "./types";

export const nextcloudBasicAuthStrategy: ConcreteBasicAuthStrategy = {
  async execute(username: string, password: string, serverUrl?: string) {
    const client = await createDAVClient({
      serverUrl: serverUrl || "http://localhost:8082/remote.php/dav/",
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
