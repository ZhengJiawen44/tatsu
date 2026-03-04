import { ConcreteBasicAuthStrategy } from "./ConcreteBasicAuthStrategy/types";

export function createBasicAuthContext() {
  let strategy: ConcreteBasicAuthStrategy | null = null;
  return {
    setStrategy(newStrategy: ConcreteBasicAuthStrategy) {
      strategy = newStrategy;
    },
    executeStrategy(username: string, password: string, serverUrl?: string) {
      if (!strategy) throw new Error("no strategy set");
      return strategy.execute(username, password, serverUrl);
    },
  };
}
