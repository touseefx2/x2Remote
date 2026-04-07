import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type RemoteButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function RemoteButton({ label, onPress, disabled = false }: RemoteButtonProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : undefined,
        pressed ? styles.buttonPressed : undefined,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    button: {
      minWidth: moderateWidthScale(96),
      borderRadius: moderateWidthScale(12),
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateWidthScale(14),
      paddingVertical: moderateHeightScale(12),
    },
    buttonPressed: {
      opacity: 0.86,
    },
    buttonDisabled: {
      opacity: 0.45,
    },
    label: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size13,
      color: colors.textOnPrimary,
    },
  });
