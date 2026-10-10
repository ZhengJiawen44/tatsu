import {
  CalDavAuthStrategy,
  CalDavCredentials,
} from "./ConcreteBasicAuthStrategy/types";

export function createBasicAuthContext() {
  let strategy: CalDavAuthStrategy | null = null;
  return {
    setStrategy(newStrategy: CalDavAuthStrategy) {
      strategy = newStrategy;
    },
    executeStrategy(credentials: CalDavCredentials) {
      if (!strategy) throw new Error("no strategy set");
      return strategy.execute(credentials);
    },
  };
}
