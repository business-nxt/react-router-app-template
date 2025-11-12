/**
 * Utility functions for handling Safari's Storage Access API
 * Required for third-party cookie and storage access in iframes
 */

export interface StorageAccessStatus {
  hasAccess: boolean;
  isThirdPartyContext: boolean;
  needsRequest: boolean;
  error?: string;
}

/**
 * Check if we're running in a third-party iframe context
 */
export function isThirdPartyContext(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    // If we can't access window.top, we're definitely in a third-party context
    return true;
  }
}

/**
 * Check if the browser supports the Storage Access API
 */
export function supportsStorageAccessAPI(): boolean {
  return "requestStorageAccess" in document;
}

/**
 * Check if we have storage access
 */
export async function hasStorageAccess(): Promise<boolean> {
  if (!supportsStorageAccessAPI()) {
    // If API not supported, assume we have access (non-Safari browsers)
    return true;
  }

  if (!isThirdPartyContext()) {
    // Not in iframe, we have access
    return true;
  }

  try {
    return await document.hasStorageAccess();
  } catch (error) {
    console.error("Error checking storage access:", error);
    return false;
  }
}

/**
 * Request storage access from the user
 * Note: This must be called in response to a user gesture (click, etc.)
 */
export async function requestStorageAccess(): Promise<boolean> {
  if (!supportsStorageAccessAPI()) {
    console.warn("Storage Access API not supported");
    return true;
  }

  if (!isThirdPartyContext()) {
    return true;
  }

  try {
    await document.requestStorageAccess();
    console.log("Storage access granted");
    return true;
  } catch (error) {
    console.error("Storage access denied:", error);
    return false;
  }
}

/**
 * Get comprehensive storage access status
 */
export async function getStorageAccessStatus(): Promise<StorageAccessStatus> {
  const isThirdParty = isThirdPartyContext();
  const supportsAPI = supportsStorageAccessAPI();

  if (!isThirdParty) {
    return {
      hasAccess: true,
      isThirdPartyContext: false,
      needsRequest: false,
    };
  }

  if (!supportsAPI) {
    return {
      hasAccess: false,
      isThirdPartyContext: true,
      needsRequest: false,
      error: "Storage Access API not supported",
    };
  }

  try {
    const hasAccess = await hasStorageAccess();
    return {
      hasAccess,
      isThirdPartyContext: true,
      needsRequest: !hasAccess,
    };
  } catch (error) {
    return {
      hasAccess: false,
      isThirdPartyContext: true,
      needsRequest: true,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test if storage (IndexedDB/localStorage) is actually accessible
 */
export async function testStorageAccess(): Promise<boolean> {
  try {
    // Test localStorage
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);

    // Test IndexedDB
    const dbName = "__storage_test_db__";
    const request = indexedDB.open(dbName);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        request.result.close();
        indexedDB.deleteDatabase(dbName);
        resolve(true);
      };
      request.onerror = () => {
        resolve(false);
      };
      request.onblocked = () => {
        resolve(false);
      };
    });
  } catch (error) {
    console.error("Storage test failed:", error);
    return false;
  }
}
