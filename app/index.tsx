import { Text } from "@/src/components/AppText";
import { IRRemoteScreen } from "@/src/screens/IRRemoteScreen";
import { SmartDeviceScreen } from "@/src/screens/SmartDeviceScreen";
import { UniversalRemoteScreen } from "@/src/screens/UniversalRemoteScreen";
import { irService } from "@/src/services/irService";
import type { RemoteMode } from "@/src/types/remote";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function Index() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<RemoteMode>("ir");
  const [irSupported, setIrSupported] = useState<boolean>(true);

  useEffect(() => {
    void irService.getCapability().then((result) => {
      setIrSupported(result.supported);
    });
  }, []);

  const tabs = [
    { key: "ir" as const, label: t("irRemote") as string },
    { key: "smart" as const, label: t("smartDevices") as string },
    { key: "universal" as const, label: t("universal") as string },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tabItem,
              activeTab === tab.key ? styles.tabItemActive : undefined,
            ]}
          >
            <Text style={styles.tabLabel}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      {!irSupported ? (
        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>{t("irTabWarning")}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        {activeTab === "ir" ? <IRRemoteScreen /> : null}
        {activeTab === "smart" ? <SmartDeviceScreen /> : null}
        {activeTab === "universal" ? <UniversalRemoteScreen /> : null}
      </View>
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: moderateWidthScale(10),
      paddingTop: moderateHeightScale(10),
      backgroundColor: colors.background,
      gap: moderateHeightScale(10),
    },
    tabBar: {
      flexDirection: "row",
      gap: moderateWidthScale(6),
    },
    tabItem: {
      flex: 1,
      borderRadius: moderateWidthScale(10),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      paddingVertical: moderateHeightScale(10),
      alignItems: "center",
    },
    tabItemActive: {
      backgroundColor: colors.primary,
    },
    tabLabel: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size13,
      color: colors.text,
    },
    noticeBar: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      borderRadius: moderateWidthScale(10),
      backgroundColor: colors.card,
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(8),
    },
    noticeText: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
      opacity: 0.85,
    },
    content: {
      flex: 1,
    },
  });
