import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CatProfile } from "../../types/profile";
import { formatAge } from "../../utils/formatAge";

Font.register({
  family: "Helvetica",
  src: "https://fonts.gstatic.com/s/helveticaneue/v1/Helvetica.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica", fontSize: 10 },
  header: { flexDirection: "row", marginBottom: 16 },
  headerCol: { flex: 1, alignItems: "center" },
  catName: { fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 12 },
  col: { flex: 1, paddingRight: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#888",
  },
});

interface MergedPDFProps {
  profileA: CatProfile;
  profileB: CatProfile;
}

export default function MergedPDF({ profileA, profileB }: MergedPDFProps) {
  const footer = (
    <View style={styles.footer} fixed>
      <Text>Made with PawBrief</Text>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerCol}>
            <Text style={styles.catName}>
              {profileA.basics?.name ?? "Cat A"}
            </Text>
          </View>
          <View style={styles.headerCol}>
            <Text style={styles.catName}>
              {profileB.basics?.name ?? "Cat B"}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            {profileA.basics && (
              <>
                <Text style={styles.sectionTitle}>Basics</Text>
                <Text>Name: {profileA.basics.name}</Text>
                {profileA.basics.breed && (
                  <Text>Breed: {profileA.basics.breed}</Text>
                )}
                <Text>
                  Age:{" "}
                  {formatAge(profileA.basics.ageValue, profileA.basics.ageUnit)}
                </Text>
              </>
            )}
          </View>
          <View style={styles.col}>
            {profileB.basics && (
              <>
                <Text style={styles.sectionTitle}>Basics</Text>
                <Text>Name: {profileB.basics.name}</Text>
                {profileB.basics.breed && (
                  <Text>Breed: {profileB.basics.breed}</Text>
                )}
                <Text>
                  Age:{" "}
                  {formatAge(profileB.basics.ageValue, profileB.basics.ageUnit)}
                </Text>
              </>
            )}
          </View>
        </View>
        {profileA.feeding && profileB.feeding && (
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Feeding</Text>
              {profileA.feeding.foodEntries.map((entry, i) => (
                <Text key={i}>
                  {entry.brand} — {entry.flavor}
                </Text>
              ))}
              <Text>Serving: {profileA.feeding.servingGrams}g</Text>
              <Text>Times: {profileA.feeding.feedingTimes.join(", ")}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Feeding</Text>
              {profileB.feeding.foodEntries.map((entry, i) => (
                <Text key={i}>
                  {entry.brand} — {entry.flavor}
                </Text>
              ))}
              <Text>Serving: {profileB.feeding.servingGrams}g</Text>
              <Text>Times: {profileB.feeding.feedingTimes.join(", ")}</Text>
            </View>
          </View>
        )}
        {profileA.medical && profileB.medical && (
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Medical</Text>
              <Text>Vet: {profileA.medical.vet.name}</Text>
              <Text>Phone: {profileA.medical.vet.phone}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Medical</Text>
              <Text>Vet: {profileB.medical.vet.name}</Text>
              <Text>Phone: {profileB.medical.vet.phone}</Text>
            </View>
          </View>
        )}
        {footer}
      </Page>
    </Document>
  );
}
