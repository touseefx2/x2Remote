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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export function SmartDeviceScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { devices, discover, error, loading } = useDeviceDiscovery();
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [pairing, setPairing] = useState(false);

  const tvDevices = useMemo(
    () => devices.filter((d) => d.type === "smart_tv"),
    [devices],
  );
  const acDevices = useMemo(
    () => devices.filter((d) => d.type === "smart_ac"),
    [devices],
  );

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

      <View style={styles.toolbar}>
        <Text style={styles.screenTitle}>{t("smartDevices")}</Text>
        <RemoteButton
          label={t("retry") as string}
          onPress={() => void discover()}
          disabled={loading}
        />
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

      {!loading && devices.length > 0 ? (
        <View style={styles.sections}>
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons
                  name="television"
                  size={moderateWidthScale(20)}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>{t("smartSectionTvs")}</Text>
              </View>
              <Text style={styles.sectionCount}>{String(tvDevices.length)}</Text>
            </View>
            {tvDevices.length === 0 ? (
              <Text style={styles.sectionEmpty}>{t("smartSectionNoTvs")}</Text>
            ) : (
              <View style={styles.list}>
                {tvDevices.map((device) => (
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
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons
                  name="air-conditioner"
                  size={moderateWidthScale(20)}
                  color={colors.primary}
                />
                <Text style={styles.sectionTitle}>{t("smartSectionAcs")}</Text>
              </View>
              <Text style={styles.sectionCount}>{String(acDevices.length)}</Text>
            </View>
            {acDevices.length === 0 ? (
              <Text style={styles.sectionEmpty}>{t("smartSectionNoAcs")}</Text>
            ) : (
              <View style={styles.list}>
                {acDevices.map((device) => (
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
            )}
          </View>
        </View>
      ) : null}

      {pairing ? <Text style={styles.infoText}>{t("pairingInProgress")}</Text> : null}

      {selectedDevice ? (
        <View style={styles.controlsWrap}>
          <Text style={styles.subtitle}>{selectedDevice.name}</Text>
          {selectedDevice.type === "smart_tv" ? (
            <View style={styles.controlRow}>
              <RemoteButton
                label={t("power") as string}
                onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "power")}
              />
              <RemoteButton
                label={t("volumeUp") as string}
                onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "volumeUp")}
              />
              <RemoteButton
                label={t("volumeDown") as string}
                onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "volumeDown")}
              />
              <RemoteButton
                label={t("navigation") as string}
                onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "navUp")}
              />
              <RemoteButton
                label={t("youtube") as string}
                onPress={() => void smartDeviceService.sendTvCommand(selectedDevice, "appYoutube")}
              />
            </View>
          ) : (
            <View style={styles.controlRow}>
              <RemoteButton
                label={t("power") as string}
                onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "power")}
              />
              <RemoteButton
                label={t("tempUp") as string}
                onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "tempUp")}
              />
              <RemoteButton
                label={t("tempDown") as string}
                onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "tempDown")}
              />
              <RemoteButton
                label={t("mode") as string}
                onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "mode")}
              />
              <RemoteButton
                label={t("fanSpeed") as string}
                onPress={() => void smartDeviceService.sendAcCommand(selectedDevice, "fan")}
              />
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
      paddingBottom: moderateHeightScale(28),
      gap: moderateHeightScale(14),
    },
    toolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    screenTitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size17,
      color: colors.text,
      letterSpacing: -0.2,
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
    sections: {
      gap: moderateHeightScale(16),
    },
    section: {
      borderRadius: moderateWidthScale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(10),
    },
    sectionHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(8),
    },
    sectionTitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size15,
      color: colors.text,
    },
    sectionCount: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.textOnPrimary,
      backgroundColor: colors.primary,
      overflow: "hidden",
      borderRadius: moderateWidthScale(10),
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(3),
    },
    sectionEmpty: {
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.65,
    },
    guideCard: {
      borderRadius: moderateWidthScale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(14),
      gap: moderateHeightScale(8),
    },
    guideTitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size15,
      color: colors.text,
    },
    controlsWrap: {
      borderRadius: moderateWidthScale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(14),
      gap: moderateHeightScale(10),
    },
    controlRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(8),
    },
  });
