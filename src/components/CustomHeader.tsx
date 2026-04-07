import { HeaderControls } from "@/src/components/HeaderControls";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/config/dimensions";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IMAGES } from "../config/images";
import { useI18n } from "../i18n/I18nContext";

type CustomHeaderProps = {
  title?: string;
};

export function CustomHeader({ title }: CustomHeaderProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { isRTL } = useI18n();
  const styles = useMemo(
    () => createStyles(colors, insets.top, isRTL),
    [colors, insets.top, isRTL],
  );

  return (
    <View style={styles.wrapper} accessibilityRole="header">
      <View style={styles.inner}>
        <HeaderControls />
      </View>
      <Image source={IMAGES.headerLogo} style={styles.logo} />
    </View>
  );
}

const createStyles = (colors: Theme, topInset: number, isRTL: boolean) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.background,
      paddingTop: topInset,
      paddingHorizontal: moderateWidthScale(12),
      paddingBottom: moderateWidthScale(40),
    },
    inner: {
      gap: moderateWidthScale(8),
      alignSelf: "flex-end",
    },
    logo: {
      width: moderateWidthScale(70),
      height: moderateHeightScale(60),
      position: "absolute",
      top: topInset,
      left: moderateWidthScale(isRTL ? 0 : 12),
      right: moderateWidthScale(isRTL ? 12 : 0),
      transform: [{ scaleX: isRTL ? -1 : 1 }],
    },
  });
