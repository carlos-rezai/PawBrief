import { View, Text } from "@react-pdf/renderer";
import { colors, typeScale } from "./pdfTokens";

interface KVProps {
  label: string;
  value: string;
}

export function KV({ label, value }: KVProps) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <Text
        style={{
          width: 96,
          fontFamily: "Plus Jakarta Sans",
          fontSize: typeScale.small.fontSize,
          fontWeight: 700,
          color: colors.muted,
          marginRight: 10,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontSize: typeScale.small.fontSize,
          fontWeight: typeScale.small.fontWeight,
          color: colors.ink,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
