import { CustomHeader } from "@/src/components/CustomHeader";
import { Font } from "@/src/config/fonts";
import { I18nProvider, useI18n } from "@/src/i18n/I18nContext";
import { ThemeProvider, useAppTheme } from "@/src/theme/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

void SplashScreen.preventAutoHideAsync();

const AppText = Text as typeof Text & {
  defaultProps?: { allowFontScaling?: boolean };
};
const AppTextInput = TextInput as typeof TextInput & {
  defaultProps?: { allowFontScaling?: boolean };
};

AppText.defaultProps = AppText.defaultProps ?? {};
AppText.defaultProps.allowFontScaling = false;

AppTextInput.defaultProps = AppTextInput.defaultProps ?? {};
AppTextInput.defaultProps.allowFontScaling = false;

function AppNavigator() {
  const [fontsLoaded] = useFonts(Font);
  const { colors, mode, hydrated: themeHydrated } = useAppTheme();
  const { hydrated: languageHydrated, isRTL } = useI18n();
  const isReady = fontsLoaded && themeHydrated && languageHydrated;

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <View style={{ flex: 1, direction: isRTL ? "rtl" : "ltr" }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <CustomHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: colors.background },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <I18nProvider>
            <MenuProvider>
              <AppNavigator />
            </MenuProvider>
          </I18nProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
