import { useDeviceDiscovery } from "@/src/hooks/useDeviceDiscovery";
import { storageService } from "@/src/services/storageService";
import type { SmartDevice } from "@/src/types/remote";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useSmartControlTargets() {
  const { devices, discover, loading, error } = useDeviceDiscovery();
  const [storedPaired, setStoredPaired] = useState<SmartDevice[]>([]);

  const loadPaired = useCallback(async () => {
    setStoredPaired(await storageService.getPairedDevices());
  }, []);

  useEffect(() => {
    void loadPaired();
  }, [loadPaired, devices]);

  useFocusEffect(
    useCallback(() => {
      void loadPaired();
    }, [loadPaired]),
  );

  const networkTvs = useMemo(() => {
    const byId = new Map<string, SmartDevice>();
    for (const p of storedPaired) {
      if (p.type === "smart_tv") {
        byId.set(p.id, { ...p, paired: true });
      }
    }
    for (const d of devices) {
      if (d.type !== "smart_tv") continue;
      const prev = byId.get(d.id);
      byId.set(d.id, { ...d, paired: prev?.paired ?? d.paired });
    }
    return Array.from(byId.values());
  }, [devices, storedPaired]);

  const preferredNetworkTv = networkTvs.find((t) => t.paired) ?? networkTvs[0] ?? null;

  return {
    networkTvs,
    preferredNetworkTv,
    discover,
    loading,
    error,
  };
}
