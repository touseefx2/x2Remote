import { ACControlPanel } from "@/src/components/ACControlPanel";
import { RemoteButton } from "@/src/components/RemoteButton";
import { moderateHeightScale, moderateWidthScale } from "@/src/config/dimensions";
import { fontSize, fonts } from "@/src/config/fonts";
import { useI18n } from "@/src/i18n/I18nContext";
import { AC_BRANDS, irService, TV_BRANDS } from "@/src/services/irService";
import { useAppTheme } from "@/src/theme/ThemeContext";
import { type Theme } from "@/src/theme/themes";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function IRRemoteScreen() {
  const { t } = useI18n();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [tvBrand, setTvBrand] = useState(TV_BRANDS[0]?.id ?? "samsung");
  const [acBrand, setAcBrand] = useState(AC_BRANDS[0]?.id ?? "gree");

  useEffect(() => {
    const bootstrap = async () => {
      const capability = await irService.getCapability();
      setSupported(capability.supported);
      setErrorText(capability.message ?? null);
      const [savedTv, savedAc] = await Promise.all([
        irService.getSelectedBrand("tv"),
        irService.getSelectedBrand("ac"),
      ]);
      if (savedTv) setTvBrand(savedTv);
      if (savedAc) setAcBrand(savedAc);
      setLoading(false);
    };

    void bootstrap();
  }, []);

  const onSelectBrand = async (type: "tv" | "ac", brandId: string) => {
    if (type === "tv") {
      setTvBrand(brandId);
    } else {
      setAcBrand(brandId);
    }
    await irService.setSelectedBrand(type, brandId);
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (!supported) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("irUnavailableTitle")}</Text>
          <Text style={styles.stateSubtitle}>{errorText ?? t("irUnavailable")}</Text>
          <Text style={styles.stateSubtitle}>{t("irIssueReason")}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("howToUseIrTitle")}</Text>
          <Text style={styles.stateSubtitle}>{t("irInstructionStep1")}</Text>
          <Text style={styles.stateSubtitle}>{t("irInstructionStep2")}</Text>
          <Text style={styles.stateSubtitle}>{t("irInstructionStep3")}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("howToUseIrTitle")}</Text>
        <Text style={styles.stateSubtitle}>{t("irInstructionStep1")}</Text>
        <Text style={styles.stateSubtitle}>{t("irInstructionStep2")}</Text>
        <Text style={styles.stateSubtitle}>{t("irInstructionStep3")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("tvBrand")}</Text>
        <View style={styles.brandRow}>
          {TV_BRANDS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => void onSelectBrand("tv", item.id)}
              style={[styles.brandChip, tvBrand === item.id ? styles.brandChipActive : undefined]}
            >
              <Text style={styles.brandChipLabel}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.controlsRow}>
          <RemoteButton label={t("power") as string} onPress={() => void irService.sendTvCommand("power")} />
          <RemoteButton label={t("volumeUp") as string} onPress={() => void irService.sendTvCommand("volumeUp")} />
          <RemoteButton label={t("volumeDown") as string} onPress={() => void irService.sendTvCommand("volumeDown")} />
          <RemoteButton label={t("channelUp") as string} onPress={() => void irService.sendTvCommand("channelUp")} />
          <RemoteButton label={t("channelDown") as string} onPress={() => void irService.sendTvCommand("channelDown")} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("acBrand")}</Text>
        <View style={styles.brandRow}>
          {AC_BRANDS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => void onSelectBrand("ac", item.id)}
              style={[styles.brandChip, acBrand === item.id ? styles.brandChipActive : undefined]}
            >
              <Text style={styles.brandChipLabel}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <ACControlPanel
          onPower={() => void irService.sendAcPower()}
          onTempUp={() => void irService.sendAcTemperature(true)}
          onTempDown={() => void irService.sendAcTemperature(false)}
          onModeChange={(mode) => void irService.sendAcMode(mode)}
          onFanSpeed={(speed) => void irService.sendAcFanSpeed(speed)}
        />
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(12),
      gap: moderateHeightScale(12),
    },
    loaderWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    stateSubtitle: {
      fontFamily: fonts.fontRegular,
      fontSize: fontSize.size13,
      color: colors.text,
      opacity: 0.8,
    },
    card: {
      borderRadius: moderateWidthScale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      backgroundColor: colors.card,
      padding: moderateWidthScale(12),
      gap: moderateHeightScale(10),
    },
    sectionTitle: {
      fontFamily: fonts.fontSemiBold,
      fontSize: fontSize.size15,
      color: colors.text,
    },
    brandRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(8),
    },
    brandChip: {
      borderRadius: moderateWidthScale(10),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLine,
      paddingHorizontal: moderateWidthScale(10),
      paddingVertical: moderateHeightScale(6),
    },
    brandChipActive: {
      backgroundColor: colors.primary,
    },
    brandChipLabel: {
      fontFamily: fonts.fontMedium,
      fontSize: fontSize.size12,
      color: colors.text,
    },
    controlsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: moderateWidthScale(8),
    },
  });
