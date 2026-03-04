import { createDAVClient } from "tsdav";

export type ConcreteBasicAuthStrategy = {
  execute: (
    username: string,
    password: string,
    serverUrl?: string,
  ) => ReturnType<typeof createDAVClient>;
};
