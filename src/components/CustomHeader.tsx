import { HeaderControls } from "@/src/components/HeaderControls";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomHeaderProps = {
  title?: string;
};

export function CustomHeader({ title }: CustomHeaderProps) {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(colors, insets.top),
    [colors, insets.top],
  );

  const displayTitle = title ?? t("screenTitle");

  return (
    <View style={styles.wrapper} accessibilityRole="header">
      <View style={styles.inner}>
        <Text style={styles.title} numberOfLines={1}>
          {displayTitle}
        </Text>
        <HeaderControls />
      </View>
    </View>
  );
}

const createStyles = (colors: Theme, topInset: number) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLine,
      paddingTop: topInset,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(10),
      gap: moderateWidthScale(8),
    },
    title: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size19,
      color: colors.text,
    },
  });
