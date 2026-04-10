import { moderateHeightScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { useAppTheme } from "@/src/theme/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.card,
      borderTopColor: colors.borderLine,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: moderateHeightScale(6),
      paddingBottom: Math.max(insets.bottom, moderateHeightScale(10)),
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: { elevation: 12 },
      }),
    }),
    [colors.borderLine, colors.card, colors.shadow, insets.bottom],
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle,
        tabBarLabelStyle: {
          fontFamily: fonts.fontSemiBold,
          fontSize: fontSize.size11,
          marginBottom: moderateHeightScale(2),
        },
        tabBarIconStyle: { marginTop: moderateHeightScale(4) },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("irRemote") as string,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="remote" size={size ?? 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="smart"
        options={{
          title: t("tabLabelSmart") as string,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="devices"
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="universal"
        options={{
          title: t("universal") as string,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="gesture-tap"
              size={size ?? 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
