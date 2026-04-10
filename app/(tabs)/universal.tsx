import { UniversalRemoteScreen } from "@/src/screens/UniversalRemoteScreen";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function UniversalTabScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <UniversalRemoteScreen />
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
