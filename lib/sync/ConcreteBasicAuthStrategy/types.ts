import { createDAVClient } from "tsdav";

export type CalDavCredentials = {
  username?: string | null;
  password?: string | null;
  serverUrl?: string | null;
  refreshToken?: string | null;
};

export type CalDavAuthStrategy = {
  execute: (
    credentials: CalDavCredentials,
  ) => ReturnType<typeof createDAVClient>;
};
