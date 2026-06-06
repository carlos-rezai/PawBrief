import type { ReactNode } from "react";
import { View, Text } from "@react-pdf/renderer";
import { colors, typeScale } from "./pdfTokens";

interface GSectionProps {
  n: number;
  title: string;
  children?: ReactNode;
}

export function GSection({ n, title, children }: GSectionProps) {
  return (
    // Sections may wrap across pages; subsections inside opt out individually so
    // a page break only happens between subsections, never mid-subsection.
    <View style={{ marginTop: 18 }}>
      <View
        // Keep the heading from being stranded alone at the foot of a page —
        // it pulls to the next page unless a subsection can follow it.
        minPresenceAhead={60}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 10,
              fontWeight: 800,
              color: colors.primary,
            }}
          >
            {String(n)}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: typeScale.sectionHd.fontSize,
            fontWeight: typeScale.sectionHd.fontWeight,
            letterSpacing: -0.3,
            color: colors.ink,
            marginRight: 8,
          }}
        >
          {title}
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>
      {children}
    </View>
  );
}
