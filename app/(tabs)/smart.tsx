import { SmartDeviceScreen } from "@/src/screens/SmartDeviceScreen";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function SmartTabScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <SmartDeviceScreen />
    </View>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
