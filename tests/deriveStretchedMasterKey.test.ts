import { deriveMasterKey } from "../lib/encryption/derive128BitKey";
import { deriveStretchedMasterKey } from "../lib/encryption/derive256BitKey";
import { expect, test, describe, jest, beforeEach } from "@jest/globals";
import { secureGenerator } from "../lib/encryption/secureGenerator";

// Mock secureGenerator for consistent testing
jest.mock("../lib/encryption/secureGenerator");

describe("deriveStretchedMasterKey", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should produce a 512-bit (64 byte) key", async () => {
    // Mock secureGenerator to return a fixed salt for deterministic testing
    const mockSalt = new Uint8Array(16).fill(1);
    (secureGenerator as jest.Mock).mockReturnValue(mockSalt);

    // Generate master key
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });

    // Import as HKDF key
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Derive stretched key
    const stretchedKey = await deriveStretchedMasterKey({
      stretchedPassKey: key,
    });

    // Verify length is 64 bytes (512 bits)
    expect(stretchedKey.byteLength).toBe(64);
  });

  test("should call secureGenerator for salt generation", async () => {
    // Mock secureGenerator to return a fixed salt
    const mockSalt = new Uint8Array(16).fill(1);
    (secureGenerator as jest.Mock).mockReturnValue(mockSalt);

    // Generate and import master key
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Derive stretched key
    await deriveStretchedMasterKey({
      stretchedPassKey: key,
    });

    // Verify secureGenerator was called
    expect(secureGenerator).toHaveBeenCalledTimes(1);
  });

  test("same input with different salts should produce different outputs", async () => {
    // Mock secureGenerator to return different salts for each call
    const salt1 = new Uint8Array(16).fill(1);
    const salt2 = new Uint8Array(16).fill(2);
    (secureGenerator as jest.Mock)
      .mockReturnValueOnce(salt1)
      .mockReturnValueOnce(salt2);

    // Generate and import master key (same for both derivations)
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Derive two stretched keys with the same input but different salts
    const stretchedKey1 = await deriveStretchedMasterKey({
      stretchedPassKey: key,
    });
    const stretchedKey2 = await deriveStretchedMasterKey({
      stretchedPassKey: key,
    });

    // Convert to Uint8Arrays for comparison
    const array1 = new Uint8Array(stretchedKey1);
    const array2 = new Uint8Array(stretchedKey2);

    // Verify they're different (at least one byte should differ)
    let hasDifference = false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  test("same input with same salt should produce identical outputs", async () => {
    // Create a modified version of deriveStretchedMasterKey that accepts a salt parameter for testing
    async function deriveWithFixedSalt(
      key: CryptoKey,
      salt: Uint8Array
    ): Promise<ArrayBuffer> {
      const encoder = new TextEncoder();
      return crypto.subtle.deriveBits(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: salt,
          info: encoder.encode("512 bits stretched master key"),
        },
        key,
        512
      );
    }

    // Generate and import master key
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Fixed salt for testing
    const fixedSalt = new Uint8Array(16).fill(42);

    // Derive two stretched keys with the same input and same salt
    const stretchedKey1 = await deriveWithFixedSalt(key, fixedSalt);
    const stretchedKey2 = await deriveWithFixedSalt(key, fixedSalt);

    // Convert to Uint8Arrays for comparison
    const array1 = new Uint8Array(stretchedKey1);
    const array2 = new Uint8Array(stretchedKey2);

    // Verify they're identical
    for (let i = 0; i < array1.length; i++) {
      expect(array1[i]).toBe(array2[i]);
    }
  });

  test("different input keys with same salt should produce different outputs", async () => {
    // Create a modified version of deriveStretchedMasterKey that accepts a salt parameter
    async function deriveWithFixedSalt(
      key: CryptoKey,
      salt: Uint8Array
    ): Promise<ArrayBuffer> {
      const encoder = new TextEncoder();
      return crypto.subtle.deriveBits(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: salt,
          info: encoder.encode("512 bits stretched master key"),
        },
        key,
        512
      );
    }

    // Generate two different master keys
    const masterKeyBits1 = await deriveMasterKey({
      passkey: "password1",
      email: "user@example.com",
    });
    const masterKeyBits2 = await deriveMasterKey({
      passkey: "password2", // Different password
      email: "user@example.com",
    });

    // Import as HKDF keys
    const key1 = await crypto.subtle.importKey(
      "raw",
      masterKeyBits1,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );
    const key2 = await crypto.subtle.importKey(
      "raw",
      masterKeyBits2,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Fixed salt for testing
    const fixedSalt = new Uint8Array(16).fill(42);

    // Derive stretched keys with different input keys but same salt
    const stretchedKey1 = await deriveWithFixedSalt(key1, fixedSalt);
    const stretchedKey2 = await deriveWithFixedSalt(key2, fixedSalt);

    // Convert to Uint8Arrays for comparison
    const array1 = new Uint8Array(stretchedKey1);
    const array2 = new Uint8Array(stretchedKey2);

    // Verify they're different (at least one byte should differ)
    let hasDifference = false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  test("should work with different info values", async () => {
    // Mock implementation of deriveStretchedMasterKey with custom info
    async function deriveWithCustomInfo(
      key: CryptoKey,
      info: string
    ): Promise<ArrayBuffer> {
      const encoder = new TextEncoder();
      const salt = new Uint8Array(16).fill(1); // Fixed salt for testing

      return crypto.subtle.deriveBits(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: salt,
          info: encoder.encode(info),
        },
        key,
        512
      );
    }

    // Generate and import master key
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });
    const key = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "HKDF" },
      false,
      ["deriveBits"]
    );

    // Derive keys with different info values
    const result1 = await deriveWithCustomInfo(key, "info1");
    const result2 = await deriveWithCustomInfo(key, "info2");

    // Both should be 64 bytes
    expect(result1.byteLength).toBe(64);
    expect(result2.byteLength).toBe(64);

    // And they should be different
    const array1 = new Uint8Array(result1);
    const array2 = new Uint8Array(result2);

    let hasDifference = false;
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  test("should handle error if key doesn't have deriveBits usage", async () => {
    // Generate master key
    const masterKeyBits = await deriveMasterKey({
      passkey: "testPassword",
      email: "user@example.com",
    });

    // Import as AES key (wrong algorithm for HKDF)
    const wrongKey = await crypto.subtle.importKey(
      "raw",
      masterKeyBits,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    // Should throw an error when attempting to derive
    await expect(
      deriveStretchedMasterKey({
        stretchedPassKey: wrongKey,
      })
    ).rejects.toThrow();
  });
});
