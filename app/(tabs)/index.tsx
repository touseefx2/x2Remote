import { Text } from "@/src/components/AppText";
import { IRRemoteScreen } from "@/src/screens/IRRemoteScreen";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { irService } from "@/src/services/irService";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function IrTabScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [irSupported, setIrSupported] = useState(true);

  useEffect(() => {
    void irService.getCapability().then((result) => {
      setIrSupported(result.supported);
    });
  }, []);

  return (
    <View style={styles.container}>
      {!irSupported ? (
        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>{t("irTabWarning")}</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <IRRemoteScreen />
      </View>
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: moderateHeightScale(8),
      backgroundColor: colors.background,
      gap: moderateHeightScale(10),
    },
    noticeBar: {
      marginHorizontal: moderateWidthScale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      borderRadius: moderateWidthScale(14),
      backgroundColor: colors.card,
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(10),
    },
    noticeText: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.88,
      lineHeight: moderateHeightScale(18),
    },
    content: {
      flex: 1,
    },
  });
