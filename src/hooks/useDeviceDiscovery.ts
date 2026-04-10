import { smartDeviceService } from "@/src/services/smartDeviceService";
import type { SmartDevice } from "@/src/types/remote";
import { useCallback, useEffect, useState } from "react";

function upsertById(prev: SmartDevice[], device: SmartDevice): SmartDevice[] {
  const idx = prev.findIndex((d) => d.id === device.id);
  if (idx === -1) return [...prev, device];
  const next = [...prev];
  next[idx] = device;
  return next;
}

export const useDeviceDiscovery = () => {
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discover = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDevices([]);
    try {
      const found = await smartDeviceService.discoverDevices({
        onDevice: (device) => {
          setDevices((prev) => upsertById(prev, device));
        },
      });
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
