import { useEffect, useState } from "react";
import {
  getStorageAccessStatus,
  requestStorageAccess,
  testStorageAccess,
  type StorageAccessStatus,
} from "~/utils/storageAccess";

export function useStorageAccess() {
  const [status, setStatus] = useState<StorageAccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageWorks, setStorageWorks] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    setIsLoading(true);
    try {
      const accessStatus = await getStorageAccessStatus();
      setStatus(accessStatus);

      // Test if storage actually works
      if (accessStatus.hasAccess) {
        const works = await testStorageAccess();
        setStorageWorks(works);
      } else {
        setStorageWorks(false);
      }
    } catch (error) {
      console.error("Error checking storage access:", error);
      setStatus({
        hasAccess: false,
        isThirdPartyContext: true,
        needsRequest: true,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      setStorageWorks(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function requestAccess(): Promise<boolean> {
    try {
      const granted = await requestStorageAccess();
      if (granted) {
        // Re-check status after requesting
        await checkAccess();
      }
      return granted;
    } catch (error) {
      console.error("Error requesting storage access:", error);
      return false;
    }
  }

  return {
    status,
    isLoading,
    storageWorks,
    needsRequest: status?.needsRequest ?? false,
    hasAccess: status?.hasAccess ?? false,
    requestAccess,
    recheckAccess: checkAccess,
  };
}
