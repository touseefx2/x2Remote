import { Text } from "@/src/components/AppText";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { RemoteButton } from "@/src/components/RemoteButton";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import type { ACMode, FanSpeed } from "@/src/types/remote";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type ACControlPanelProps = {
  onPower: () => void;
  onTempUp: () => void;
  onTempDown: () => void;
  onModeChange: (mode: ACMode) => void;
  onFanSpeed: (speed: FanSpeed) => void;
  disabled?: boolean;
};

export function ACControlPanel({
  onPower,
  onTempUp,
  onTempDown,
  onModeChange,
  onFanSpeed,
  disabled = false,
}: ACControlPanelProps) {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{t("acControls")}</Text>
      <View style={styles.row}>
        <RemoteButton label={t("power") as string} onPress={onPower} disabled={disabled} />
        <RemoteButton label={t("tempUp") as string} onPress={onTempUp} disabled={disabled} />
        <RemoteButton label={t("tempDown") as string} onPress={onTempDown} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <RemoteButton label={t("modeCool") as string} onPress={() => onModeChange("cool")} disabled={disabled} />
        <RemoteButton label={t("modeHeat") as string} onPress={() => onModeChange("heat")} disabled={disabled} />
        <RemoteButton label={t("modeFan") as string} onPress={() => onModeChange("fan")} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <RemoteButton label={t("fanAuto") as string} onPress={() => onFanSpeed("auto")} disabled={disabled} />
        <RemoteButton label={t("fanLow") as string} onPress={() => onFanSpeed("low")} disabled={disabled} />
        <RemoteButton label={t("fanHigh") as string} onPress={() => onFanSpeed("high")} disabled={disabled} />
      </View>
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    panel: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      borderRadius: moderateWidthScale(14),
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(8),
    },
    title: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size14,
      color: colors.text,
    },
    row: {
      flexDirection: "row",
      gap: moderateWidthScale(8),
      flexWrap: "wrap",
    },
  });
