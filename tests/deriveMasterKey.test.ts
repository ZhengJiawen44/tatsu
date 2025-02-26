import { deriveMasterKey } from "../lib/encryption/derive128BitKey";
import { expect, test, describe } from "@jest/globals";

describe("deriveMasterKey", () => {
  test("master key should be 32 bytes (256 bits)", async () => {
    const masterKey = await deriveMasterKey({
      passkey: "securePassword123",
      email: "user@example.com",
    });
    expect(masterKey.byteLength).toBe(32);
  });

  test("same inputs produce identical keys", async () => {
    const key1 = await deriveMasterKey({
      passkey: "testPass",
      email: "test@example.com",
    });

    const key2 = await deriveMasterKey({
      passkey: "testPass",
      email: "test@example.com",
    });

    // Convert ArrayBuffers to arrays for comparison
    const array1 = new Uint8Array(key1);
    const array2 = new Uint8Array(key2);

    expect(array1.length).toEqual(array2.length);
    for (let i = 0; i < array1.length; i++) {
      expect(array1[i]).toEqual(array2[i]);
    }
  });

  test("different passwords produce different keys", async () => {
    const key1 = await deriveMasterKey({
      passkey: "password1",
      email: "same@example.com",
    });

    const key2 = await deriveMasterKey({
      passkey: "password2",
      email: "same@example.com",
    });

    // Convert ArrayBuffers to arrays
    const array1 = new Uint8Array(key1);
    const array2 = new Uint8Array(key2);

    // Check they're different (at least one byte should differ)
    let isDifferent = false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        isDifferent = true;
        break;
      }
    }

    expect(isDifferent).toBe(true);
  });

  test("different emails (salts) produce different keys", async () => {
    const key1 = await deriveMasterKey({
      passkey: "samePassword",
      email: "user1@example.com",
    });

    const key2 = await deriveMasterKey({
      passkey: "samePassword",
      email: "user2@example.com",
    });

    const array1 = new Uint8Array(key1);
    const array2 = new Uint8Array(key2);

    let isDifferent = false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        isDifferent = true;
        break;
      }
    }

    expect(isDifferent).toBe(true);
  });

  test("custom rounds parameter works", async () => {
    const key = await deriveMasterKey({
      passkey: "testPassword",
      email: "test@example.com",
      rounds: 100, // Much lower for testing
    });

    // Just verify it completes without error
    expect(key).toBeDefined();
  });
});
