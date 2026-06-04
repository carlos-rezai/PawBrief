import { View, Text } from "@react-pdf/renderer";
import { colors } from "./pdfTokens";

interface TagProps {
  label: string;
  variant?: "primary" | "accent";
}

export function Tag({ label, variant = "primary" }: TagProps) {
  const bg = variant === "accent" ? colors.accentSoft : colors.primarySoft;
  const fg = variant === "accent" ? colors.accent : colors.primary;

  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontSize: 12,
          fontWeight: 700,
          color: fg,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
