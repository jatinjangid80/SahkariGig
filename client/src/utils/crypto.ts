// Web Crypto API AES-GCM symmetric encryption / decryption helper

/**
 * Encrypts plaintext message text using a booking-specific key.
 * @param text Plaintext message
 * @param keyString Secret key source (e.g. bookingId)
 * @returns JSON string containing base64-encoded IV and encrypted data
 */
export async function encryptMessage(text: string, keyString: string): Promise<string> {
  if (!text || !keyString) return text;
  
  try {
    const enc = new TextEncoder();
    // Derive a 32-byte key from the keyString for AES-256
    const paddedKeyString = keyString.padEnd(32, '0').substring(0, 32);
    const keyData = enc.encode(paddedKeyString);
    
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    
    // 12-byte IV is standard for AES-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(text)
    );
    
    // Convert IV and Ciphertext arrays to Base64 strings
    const ivBase64 = btoa(String.fromCharCode(...Array.from(iv)));
    const encryptedArray = new Uint8Array(encrypted);
    const encryptedBase64 = btoa(String.fromCharCode(...Array.from(encryptedArray)));
    
    // Return structured payload so receiver knows IV and data
    return JSON.stringify({
      iv: ivBase64,
      data: encryptedBase64,
      encrypted: true
    });
  } catch (error) {
    console.error("Encryption failed, falling back to plaintext:", error);
    return text;
  }
}

/**
 * Decrypts a base64 encrypted payload using a booking-specific key.
 * @param cipherJson Encrypted message payload JSON
 * @param keyString Secret key source (e.g. bookingId)
 * @returns Plaintext message text
 */
export async function decryptMessage(cipherJson: string, keyString: string): Promise<string> {
  if (!cipherJson || !keyString) return cipherJson;
  
  // If the message does not look like our encrypted JSON structure, return it as-is
  if (!cipherJson.trim().startsWith('{') || !cipherJson.includes('"data"') || !cipherJson.includes('"iv"')) {
    return cipherJson;
  }
  
  try {
    const { iv, data } = JSON.parse(cipherJson);
    const enc = new TextEncoder();
    const paddedKeyString = keyString.padEnd(32, '0').substring(0, 32);
    const keyData = enc.encode(paddedKeyString);
    
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    
    // Decode base64 strings back to Uint8Arrays
    const ivArray = new Uint8Array(
      atob(iv).split("").map((c) => c.charCodeAt(0))
    );
    const dataArray = new Uint8Array(
      atob(data).split("").map((c) => c.charCodeAt(0))
    );
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivArray },
      key,
      dataArray
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // If decryption fails, return the original string (might be plain text or corrupt)
    return cipherJson;
  }
}
