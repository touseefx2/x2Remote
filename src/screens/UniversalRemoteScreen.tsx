import { Text } from "@/src/components/AppText";
import { ACControlPanel } from "@/src/components/ACControlPanel";
import { RemoteButton } from "@/src/components/RemoteButton";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useSmartControlTargets } from "@/src/hooks/useSmartControlTargets";
import { useI18n } from "@/src/i18n/I18nContext";
import { irService } from "@/src/services/irService";
import { smartDeviceService } from "@/src/services/smartDeviceService";
import type { IRCapability } from "@/src/types/remote";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export function UniversalRemoteScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { preferredNetworkTv, networkTvs } = useSmartControlTargets();
  const [irCap, setIrCap] = useState<IRCapability | null>(null);

  useEffect(() => {
    void irService.getCapability().then(setIrCap);
  }, []);

  const irReady = irCap?.supported === true;
  const tvDisabled = !preferredNetworkTv && !irReady;

  const sendUniversalTv = useCallback(
    async (command: "power" | "volumeUp" | "volumeDown") => {
      if (preferredNetworkTv) {
        const ok = await smartDeviceService.sendTvCommand(preferredNetworkTv, command);
        if (ok) return;
      }
      if (irReady) {
        await irService.sendTvCommand(command);
      }
    },
    [irReady, preferredNetworkTv],
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("universalGuideTitle")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep1")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep2")}</Text>
        <Text style={styles.guideText}>{t("universalGuideStep3")}</Text>
        <Text style={styles.guideText}>{t("universalIrBrandHint")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t("quickTv")}</Text>
        {preferredNetworkTv ? (
          <Text style={styles.targetLabel}>
            {`${preferredNetworkTv.name} (${preferredNetworkTv.vendor ?? preferredNetworkTv.protocol})`}
          </Text>
        ) : null}
        <View style={styles.row}>
          <RemoteButton
            label={t("power") as string}
            disabled={tvDisabled}
            onPress={() => void sendUniversalTv("power")}
          />
          <RemoteButton
            label={t("volumeUp") as string}
            disabled={tvDisabled}
            onPress={() => void sendUniversalTv("volumeUp")}
          />
          <RemoteButton
            label={t("volumeDown") as string}
            disabled={tvDisabled}
            onPress={() => void sendUniversalTv("volumeDown")}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t("quickAc")}</Text>
        <ACControlPanel
          onPower={() => {
            void irService.sendAcPower();
          }}
          onTempUp={() => {
            void irService.sendAcTemperature(true);
          }}
          onTempDown={() => {
            void irService.sendAcTemperature(false);
          }}
          onModeChange={(mode) => {
            void irService.sendAcMode(mode);
          }}
          onFanSpeed={(speed) => {
            void irService.sendAcFanSpeed(speed);
          }}
          disabled={!irReady}
        />
      </View>

      {networkTvs.length === 0 ? (
        <Text style={styles.empty}>{t("universalNoNetworkTv")}</Text>
      ) : null}
      {!irReady && irCap?.message ? <Text style={styles.empty}>{irCap.message}</Text> : null}
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
    targetLabel: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.75,
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
