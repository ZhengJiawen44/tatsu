import { createBasicAuthContext } from "./basicAuthContext";
import { appleBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/appleBasicAuthStrategy";
import { baikalBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/baikalBasicAuthStrategy";
import { davicalBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/davicalBasicAuthStrategy";
import { nextcloudBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/nextcloudBasicAuthStrategy";
import { ConcreteBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/types";

const strategyMap: Record<string, ConcreteBasicAuthStrategy> = {
  apple: appleBasicAuthStrategy,
  baikal: baikalBasicAuthStrategy,
  davical: davicalBasicAuthStrategy,
  nextcloud: nextcloudBasicAuthStrategy,
};

export async function createCalDAVClient(
  service: string,
  username: string,
  password: string,
  serverUrl?: string,
) {
  const strategy = strategyMap[service];
  if (!strategy) throw new Error(`unsupported service: ${service}`);

  const context = createBasicAuthContext();
  context.setStrategy(strategy);
  return context.executeStrategy(username, password, serverUrl);
}
