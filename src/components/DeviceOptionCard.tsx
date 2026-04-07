import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import type { SmartDevice } from "@/src/types/remote";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DeviceOptionCardProps = {
  device: SmartDevice;
  onPress: () => void;
};

export function DeviceOptionCard({ device, onPress }: DeviceOptionCardProps) {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      <View style={styles.headerRow}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={styles.badge}>
          {device.paired ? t("pairedLabel") : t("newLabel")}
        </Text>
      </View>
      <Text style={styles.meta}>{`${device.type} • ${device.protocol}`}</Text>
      <Text style={styles.meta}>{device.ip}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    card: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      borderRadius: moderateWidthScale(12),
      backgroundColor: colors.card,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(10),
      gap: moderateHeightScale(5),
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size14,
      color: colors.text,
      flex: 1,
    },
    badge: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size11,
      color: colors.textOnPrimary,
      backgroundColor: colors.primary,
      borderRadius: moderateWidthScale(10),
      overflow: "hidden",
      paddingHorizontal: moderateWidthScale(8),
      paddingVertical: moderateHeightScale(3),
    },
    meta: {
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.8,
    },
  });
