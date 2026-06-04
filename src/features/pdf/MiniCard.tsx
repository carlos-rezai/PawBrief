import { View, Text } from "@react-pdf/renderer";
import { colors, typeScale } from "./pdfTokens";

interface MiniCardProps {
  title: string;
  subtitle?: string;
}

export function MiniCard({ title, subtitle }: MiniCardProps) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: "solid",
        borderRadius: 9,
        paddingVertical: 9,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
      }}
    >
      <Text
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontSize: typeScale.small.fontSize,
          fontWeight: 700,
          color: colors.ink,
        }}
      >
        {title}
      </Text>
      {subtitle !== undefined && (
        <Text
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: 12,
            fontWeight: 400,
            color: colors.inkSoft,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
