/**
 * Secure Storage Utility for Chrome Extension
 * 
 * Provides encrypted storage for sensitive data like API keys using:
 * - Web Crypto API (AES-GCM encryption)
 * - Chrome storage API for persistence
 * - Generated encryption key stored securely
 */

// Storage keys
const STORAGE_KEYS = {
  ENCRYPTION_KEY: 'enc_key_material',
  ENCRYPTED_API_KEY: 'encrypted_api_key',
  ENCRYPTION_IV: 'encryption_iv',
} as const;

// Type definitions
export interface EncryptedData {
  ciphertext: string;
  iv: string;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generate a cryptographic key for encryption/decryption
 * Uses a stored key material or generates a new one
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  try {
    // Try to retrieve existing key material
    const stored = await chrome.storage.local.get(STORAGE_KEYS.ENCRYPTION_KEY);

    let keyMaterial: ArrayBuffer;

    if (stored[STORAGE_KEYS.ENCRYPTION_KEY]) {
      // Convert stored base64 string back to ArrayBuffer
      const base64 = stored[STORAGE_KEYS.ENCRYPTION_KEY] as string;
      const binaryString = atob(base64);
      keyMaterial = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        (keyMaterial as Uint8Array)[i] = binaryString.charCodeAt(i);
      }
    } else {
      // Generate new random key material (256 bits for AES-256)
      keyMaterial = crypto.getRandomValues(new Uint8Array(32));

      // Store as base64 string
      const bytes = new Uint8Array(keyMaterial);
      const binaryString = String.fromCharCode(...bytes);
      const base64 = btoa(binaryString);
      await chrome.storage.local.set({ [STORAGE_KEYS.ENCRYPTION_KEY]: base64 });
    }

    // Import the key material as a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false, // not extractable
      ['encrypt', 'decrypt']
    );

    return key;
  } catch (error) {
    console.error('Error generating encryption key:', error);
    throw new Error('Failed to generate encryption key');
  }
}

/**
 * Encrypt a string value using AES-GCM
 */
async function encryptValue(plaintext: string): Promise<EncryptedData> {
  try {
    const key = await getOrCreateEncryptionKey();

    // Generate a random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits recommended for AES-GCM

    // Convert plaintext to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Encrypt the data
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    // Convert to base64 for storage
    const ciphertextBytes = new Uint8Array(ciphertext);
    const ciphertextBase64 = btoa(String.fromCharCode(...ciphertextBytes));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return {
      ciphertext: ciphertextBase64,
      iv: ivBase64,
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt value');
  }
}

/**
 * Decrypt an encrypted value using AES-GCM
 */
async function decryptValue(encryptedData: EncryptedData): Promise<string> {
  try {
    const key = await getOrCreateEncryptionKey();

    // Convert base64 back to ArrayBuffer
    const ciphertextBinary = atob(encryptedData.ciphertext);
    const ciphertext = new Uint8Array(ciphertextBinary.length);
    for (let i = 0; i < ciphertextBinary.length; i++) {
      ciphertext[i] = ciphertextBinary.charCodeAt(i);
    }

    const ivBinary = atob(encryptedData.iv);
    const iv = new Uint8Array(ivBinary.length);
    for (let i = 0; i < ivBinary.length; i++) {
      iv[i] = ivBinary.charCodeAt(i);
    }

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    // Convert ArrayBuffer back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt value');
  }
}

/**
 * Securely store an API key with encryption
 */
export async function storeApiKey(apiKey: string): Promise<StorageResult<void>> {
  try {
    if (!apiKey || apiKey.trim().length === 0) {
      return {
        success: false,
        error: 'API key cannot be empty',
      };
    }

    // Encrypt the API key
    const encrypted = await encryptValue(apiKey);

    // Store encrypted data
    await chrome.storage.local.set({
      [STORAGE_KEYS.ENCRYPTED_API_KEY]: encrypted.ciphertext,
      [STORAGE_KEYS.ENCRYPTION_IV]: encrypted.iv,
    });

    return { success: true };
  } catch (error) {
    console.error('Error storing API key:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Retrieve and decrypt the stored API key
 */
export async function retrieveApiKey(): Promise<StorageResult<string>> {
  try {
    // Retrieve encrypted data
    const stored = await chrome.storage.local.get([
      STORAGE_KEYS.ENCRYPTED_API_KEY,
      STORAGE_KEYS.ENCRYPTION_IV,
    ]);

    const ciphertext = stored[STORAGE_KEYS.ENCRYPTED_API_KEY] as string | undefined;
    const iv = stored[STORAGE_KEYS.ENCRYPTION_IV] as string | undefined;

    if (!ciphertext || !iv) {
      return {
        success: false,
        error: 'No API key found',
      };
    }

    // Decrypt the API key
    const decrypted = await decryptValue({ ciphertext, iv });

    return {
      success: true,
      data: decrypted,
    };
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if an API key is stored
 */
export async function hasApiKey(): Promise<boolean> {
  try {
    const stored = await chrome.storage.local.get([STORAGE_KEYS.ENCRYPTED_API_KEY]);
    return !!stored[STORAGE_KEYS.ENCRYPTED_API_KEY];
  } catch (error) {
    console.error('Error checking for API key:', error);
    return false;
  }
}

/**
 * Remove the stored API key and encryption data
 */
export async function clearApiKey(): Promise<StorageResult<void>> {
  try {
    await chrome.storage.local.remove([
      STORAGE_KEYS.ENCRYPTED_API_KEY,
      STORAGE_KEYS.ENCRYPTION_IV,
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error clearing API key:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clear all encryption data including the encryption key
 * WARNING: This will make any stored encrypted data unrecoverable
 */
export async function clearAllEncryptionData(): Promise<StorageResult<void>> {
  try {
    await chrome.storage.local.remove([
      STORAGE_KEYS.ENCRYPTION_KEY,
      STORAGE_KEYS.ENCRYPTED_API_KEY,
      STORAGE_KEYS.ENCRYPTION_IV,
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error clearing encryption data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Migrate from plain text API key storage to encrypted storage
 * Call this once to migrate existing installations
 */
export async function migrateFromPlainTextStorage(
  oldStorageKey: string = 'apiKey'
): Promise<StorageResult<void>> {
  try {
    // Check if already using encrypted storage
    const hasEncrypted = await hasApiKey();
    if (hasEncrypted) {
      return {
        success: true,
        data: undefined,
      };
    }

    // Try to retrieve old plain text API key
    const oldStorage = await chrome.storage.local.get(oldStorageKey);
    const plainApiKey = oldStorage[oldStorageKey] as string | undefined;

    if (!plainApiKey) {
      return {
        success: false,
        error: 'No plain text API key found to migrate',
      };
    }

    // Store with encryption
    const storeResult = await storeApiKey(plainApiKey);

    if (storeResult.success) {
      // Remove old plain text storage
      await chrome.storage.local.remove(oldStorageKey);
      console.log('Successfully migrated API key to encrypted storage');
    }

    return storeResult;
  } catch (error) {
    console.error('Error migrating API key:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
