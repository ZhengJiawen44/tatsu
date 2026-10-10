import { createBasicAuthContext } from "./basicAuthContext";
import { appleBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/appleBasicAuthStrategy";
import { baikalBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/baikalBasicAuthStrategy";
import { davicalBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/davicalBasicAuthStrategy";
import { nextcloudBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/nextcloudBasicAuthStrategy";
import { googleBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/googleBasicAuthStrategy";
import {
  CalDavAuthStrategy,
  CalDavCredentials,
} from "./ConcreteBasicAuthStrategy/types";

const strategyMap: Record<string, CalDavAuthStrategy> = {
  apple: appleBasicAuthStrategy,
  baikal: baikalBasicAuthStrategy,
  davical: davicalBasicAuthStrategy,
  nextcloud: nextcloudBasicAuthStrategy,
  google: googleBasicAuthStrategy,
};

export async function createCalDAVClient(
  service: string,
  credentials: CalDavCredentials = {},
) {
  const strategy = strategyMap[service];
  if (!strategy) throw new Error(`unsupported service: ${service}`);

  const context = createBasicAuthContext();
  context.setStrategy(strategy);
  return context.executeStrategy(credentials);
}
