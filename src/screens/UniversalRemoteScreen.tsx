import { Text } from "@/src/components/AppText";
import { ACControlPanel } from "@/src/components/ACControlPanel";
import { RemoteButton } from "@/src/components/RemoteButton";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { irService } from "@/src/services/irService";
import { useDeviceDiscovery } from "@/src/hooks/useDeviceDiscovery";
import { smartDeviceService } from "@/src/services/smartDeviceService";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export function UniversalRemoteScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { devices } = useDeviceDiscovery();
  const [irSupported, setIrSupported] = useState(false);

  useEffect(() => {
    void irService.getCapability().then((value) => setIrSupported(value.supported));
  }, []);

  const firstDevice = devices[0];

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("universalGuideTitle")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep1")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep2")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep3")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t("quickTv")}</Text>
        <View style={styles.row}>
          <RemoteButton
            label={t("power") as string}
            onPress={() => {
              if (irSupported) {
                void irService.sendTvCommand("power");
              } else if (firstDevice) {
                void smartDeviceService.sendTvCommand(firstDevice, "power");
              }
            }}
          />
          <RemoteButton
            label={t("volumeUp") as string}
            onPress={() => {
              if (irSupported) {
                void irService.sendTvCommand("volumeUp");
              } else if (firstDevice) {
                void smartDeviceService.sendTvCommand(firstDevice, "volumeUp");
              }
            }}
          />
          <RemoteButton
            label={t("volumeDown") as string}
            onPress={() => {
              if (irSupported) {
                void irService.sendTvCommand("volumeDown");
              } else if (firstDevice) {
                void smartDeviceService.sendTvCommand(firstDevice, "volumeDown");
              }
            }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t("quickAc")}</Text>
        <ACControlPanel
          onPower={() => {
            if (irSupported) {
              void irService.sendAcPower();
            }
          }}
          onTempUp={() => {
            if (irSupported) {
              void irService.sendAcTemperature(true);
            }
          }}
          onTempDown={() => {
            if (irSupported) {
              void irService.sendAcTemperature(false);
            }
          }}
          onModeChange={(mode) => {
            if (irSupported) {
              void irService.sendAcMode(mode);
            }
          }}
          onFanSpeed={(speed) => {
            if (irSupported) {
              void irService.sendAcFanSpeed(speed);
            }
          }}
          disabled={!irSupported}
        />
      </View>

      {!firstDevice ? <Text style={styles.empty}>{t("noDevicesFound")}</Text> : null}
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
    card: {
      borderRadius: moderateWidthScale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(8),
    },
    title: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size15,
      color: colors.text,
    },
    row: {
      flexDirection: "row",
      gap: moderateWidthScale(8),
      flexWrap: "wrap",
    },
    empty: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.8,
    },
    guideText: {
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.85,
    },
  });
