import { secureGenerator } from "../secureGenerator";
export async function genSalt() {
  const salt = secureGenerator(16);
}
