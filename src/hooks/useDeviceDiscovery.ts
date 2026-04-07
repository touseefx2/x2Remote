import { smartDeviceService } from "@/src/services/smartDeviceService";
import type { SmartDevice } from "@/src/types/remote";
import { useCallback, useEffect, useState } from "react";

export const useDeviceDiscovery = () => {
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discover = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = await smartDeviceService.discoverDevices();
      setDevices(found);
    } catch {
      setError("smartDiscoveryFailed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void discover();
  }, [discover]);

  return {
    devices,
    loading,
    error,
    discover,
  };
};
