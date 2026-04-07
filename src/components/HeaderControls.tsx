import {
  iconScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { type AppLanguage } from "@/src/i18n/translations";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme, type ThemeName } from "@/src/theme/themes";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

const languageMenuItems: ReadonlyArray<{
  code: AppLanguage;
  flag: string;
  nativeName: string;
  englishName: string;
}> = [
  { code: "en", flag: "🇬🇧", nativeName: "English", englishName: "English" },
  { code: "ur", flag: "🇵🇰", nativeName: "اردو", englishName: "Urdu" },
  { code: "es", flag: "🇪🇸", nativeName: "Espanol", englishName: "Spanish" },
];

const themeMenuItems: ReadonlyArray<{
  id: ThemeName;
  label: string;
  swatch: string;
}> = [
  { id: "light", label: "Light", swatch: "#FFFFFF" },
  { id: "dark", label: "Dark", swatch: "#000000" },
  { id: "emerald", label: "Emerald", swatch: "#0F766E" },
];

export function HeaderControls() {
  const { colors, themeName, setTheme } = useAppTheme();
  const { language, setLanguage } = useI18n();
  const controlIconSize = iconScale(20);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const onSelectLanguage = (nextLanguage: AppLanguage) => {
    void setLanguage(nextLanguage);
  };

  const onSelectTheme = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
  };

  return (
    <View style={styles.row}>
      <Menu>
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
            triggerTouchable: { activeOpacity: 0.8 },
          }}
        >
          <View style={styles.iconButton}>
            <Ionicons
              name="globe-outline"
              size={controlIconSize}
              color={colors.icon}
            />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.dropdown }}>
          {languageMenuItems.map((item) => {
            const selected = item.code === language;
            return (
              <MenuOption
                key={item.code}
                onSelect={() => onSelectLanguage(item.code)}
                customStyles={{
                  optionWrapper: [
                    styles.option,
                    selected && styles.optionSelectedRow,
                  ],
                }}
              >
                <View style={styles.languageRow}>
                  <Text style={styles.flag}>{item.flag}</Text>
                  <View style={styles.languageTextBlock}>
                    <Text
                      style={[
                        styles.languageNativeText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.languageEnglishText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item.englishName}
                    </Text>
                  </View>
                </View>
              </MenuOption>
            );
          })}
        </MenuOptions>
      </Menu>

      <Menu>
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
            triggerTouchable: { activeOpacity: 0.8 },
          }}
        >
          <View style={styles.iconButton}>
            <Ionicons
              name="color-palette-outline"
              size={controlIconSize}
              color={colors.icon}
            />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.dropdown }}>
          {themeMenuItems.map((themeOption) => {
            const selected = themeOption.id === themeName;
            return (
              <MenuOption
                key={themeOption.id}
                onSelect={() => onSelectTheme(themeOption.id)}
                customStyles={{
                  optionWrapper: [
                    styles.option,
                    selected && styles.optionSelectedRow,
                  ],
                }}
              >
                <View style={styles.themeRow}>
                  <View
                    style={[
                      styles.themeSwatch,
                      { backgroundColor: themeOption.swatch },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {themeOption.label}
                  </Text>
                </View>
              </MenuOption>
            );
          })}
        </MenuOptions>
      </Menu>
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
    },
    iconButton: {
      width: iconScale(34),
      height: iconScale(34),
      borderRadius: iconScale(17),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
    },
    dropdown: {
      width: moderateWidthScale(150),
      borderRadius: moderateWidthScale(12),
      borderWidth: 1,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      overflow: "hidden",
      marginTop: moderateHeightScale(8),
    },
    option: {
      paddingVertical: moderateHeightScale(10),
      paddingHorizontal: moderateWidthScale(12),
    },
    languageRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(10),
    },
    flag: {
      fontSize: fontSize.size16,
      lineHeight: fontSize.size16 * 1.2,
    },
    languageTextBlock: {
      flex: 1,
    },
    languageNativeText: {
      color: colors.text,
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size14,
    },
    languageEnglishText: {
      color: colors.text,
      opacity: 0.7,
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size14,
    },
    optionSelectedRow: {
      backgroundColor: colors.primary,
    },
    optionText: {
      color: colors.text,
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size14,
    },
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(10),
    },
    themeSwatch: {
      width: moderateWidthScale(12),
      height: moderateWidthScale(12),
      borderRadius: moderateWidthScale(6),
      borderWidth: 1,
      borderColor: colors.borderLine,
    },
    optionTextSelected: {
      color: colors.textOnPrimary,
    },
  });
