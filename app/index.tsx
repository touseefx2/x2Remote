import { Text } from "@/src/components/AppText";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("screenTitle")}</Text>
        <Text style={styles.subtitle}>{t("screenSubtitle")}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateWidthScale(12),
      backgroundColor: colors.background,
    },
    card: {
      width: "100%",
      paddingVertical: moderateHeightScale(28),
      padding: moderateWidthScale(20),
      borderRadius: moderateWidthScale(16),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      gap: moderateHeightScale(10),
    },
    title: {
      fontFamily: fonts.fontBold,
      fontSize: fontSize.size20,
      color: colors.text,
    },
    subtitle: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.85,
    },
  });
