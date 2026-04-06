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

export function HeaderControls() {
  const { colors, themeName, setTheme } = useAppTheme();
  const { language, setLanguage, labelFor, isRTL } = useI18n();
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
          {(["en", "ur", "es"] as const).map((lang) => {
            const selected = lang === language;
            return (
              <MenuOption
                key={lang}
                onSelect={() => onSelectLanguage(lang)}
                customStyles={{
                  optionWrapper: [
                    styles.option,
                    selected && styles.optionSelectedRow,
                  ],
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    // isRTL && styles.optionTextRtl,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {labelFor(lang)}
                </Text>
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
          {(["light", "dark", "blue"] as const).map((themeOption) => {
            const selected = themeOption === themeName;
            return (
              <MenuOption
                key={themeOption}
                onSelect={() => onSelectTheme(themeOption)}
                customStyles={{
                  optionWrapper: [
                    styles.option,
                    selected && styles.optionSelectedRow,
                  ],
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    // isRTL && styles.optionTextRtl,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {themeOption[0].toUpperCase()}
                  {themeOption.slice(1)}
                </Text>
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
      gap: moderateWidthScale(8),
      marginEnd: moderateWidthScale(8),
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
    optionSelectedRow: {
      backgroundColor: colors.primary,
    },
    optionText: {
      color: colors.text,
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size14,
    },
    optionTextRtl: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    optionTextSelected: {
      color: colors.textOnPrimary,
    },
  });
