import { useI18n } from "@/src/i18n/I18nContext";
import { Text as RNText, type TextProps } from "react-native";

// RN Text defaultProps.style is dropped when callers pass style (shallow merge).
export function Text({ style, ...rest }: TextProps) {
  const { isRTL } = useI18n();
  return (
    <RNText
      style={[{ writingDirection: isRTL ? "rtl" : "ltr" }, style]}
      {...rest}
    />
  );
}
