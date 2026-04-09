import { Text } from "@/src/components/AppText";
import { DeviceOptionCard } from "@/src/components/DeviceOptionCard";
import { RemoteButton } from "@/src/components/RemoteButton";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useDeviceDiscovery } from "@/src/hooks/useDeviceDiscovery";
import { useI18n } from "@/src/i18n/I18nContext";
import { smartDeviceService } from "@/src/services/smartDeviceService";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import type { SmartDevice } from "@/src/types/remote";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export function SmartDeviceScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { devices, discover, error, loading } = useDeviceDiscovery();
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [pairing, setPairing] = useState(false);

  const onPair = async (device: SmartDevice) => {
    setPairing(true);
    await smartDeviceService.pairDevice(device);
    setSelectedDevice({ ...device, paired: true });
    setPairing(false);
    await discover();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>{t("smartGuideTitle")}</Text>
        <Text style={styles.infoText}>{t("smartGuideStep1")}</Text>
        <Text style={styles.infoText}>{t("smartGuideStep2")}</Text>
        <Text style={styles.infoText}>{t("smartGuideStep3")}</Text>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.title}>{t("smartDevices")}</Text>
        <RemoteButton label={t("retry") as string} onPress={() => void discover()} disabled={loading} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {!loading && devices.length === 0 ? (
        <Text style={styles.emptyText}>{t("noDevicesFound")}</Text>
      ) : null}

      {error ? <Text style={styles.errorText}>{t("smartDiscoveryFailed")}</Text> : null}

      <View style={styles.list}>
        {devices.map((device) => (
          <DeviceOptionCard
            key={device.id}
            device={device}
            onPress={() => {
              if (!device.paired) {
                void onPair(device);
                return;
              }
              setSelectedDevice(device);
            }}
          />
        ))}
      </View>

      {pairing ? <Text style={styles.infoText}>{t("pairingInProgress")}</Text> : null}

      {selectedDevice ? (
        <View style={styles.controlsWrap}>
          <Text style={styles.subtitle}>{selectedDevice.name}</Text>
          {selectedDevice.type === "smart_tv" ? (
            <View style={styles.controlRow}>
              <RemoteButton label={t("power") as string} onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "power")} />
              <RemoteButton label={t("volumeUp") as string} onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "volumeUp")} />
              <RemoteButton label={t("volumeDown") as string} onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "volumeDown")} />
              <RemoteButton label={t("navigation") as string} onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "navUp")} />
              <RemoteButton label={t("youtube") as string} onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "appYoutube")} />
            </View>
          ) : (
            <View style={styles.controlRow}>
              <RemoteButton label={t("power") as string} onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "power")} />
              <RemoteButton label={t("tempUp") as string} onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "tempUp")} />
              <RemoteButton label={t("tempDown") as string} onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "tempDown")} />
              <RemoteButton label={t("mode") as string} onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "mode")} />
              <RemoteButton label={t("fanSpeed") as string} onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "fan")} />
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(12),
      gap: moderateHeightScale(12),
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    title: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size16,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size14,
      color: colors.text,
    },
    emptyText: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size13,
      color: colors.text,
      opacity: 0.8,
    },
    errorText: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.primary,
      opacity: 0.9,
    },
    infoText: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.75,
    },
    loaderWrap: {
      paddingVertical: moderateHeightScale(20),
    },
    list: {
      gap: moderateHeightScale(8),
    },
    guideCard: {
      borderRadius: moderateWidthScale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(6),
    },
    guideTitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size14,
      color: colors.text,
    },
    controlsWrap: {
      borderRadius: moderateWidthScale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(8),
    },
    controlRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(8),
    },
  });
