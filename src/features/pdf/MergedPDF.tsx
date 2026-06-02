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
              {profileA.feeding.servings.map((s, i) => (
                <Text key={i}>
                  {s.grams}g at {s.time}
                </Text>
              ))}
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Feeding</Text>
              {profileB.feeding.foodEntries.map((entry, i) => (
                <Text key={i}>
                  {entry.brand} — {entry.flavor}
                </Text>
              ))}
              {profileB.feeding.servings.map((s, i) => (
                <Text key={i}>
                  {s.grams}g at {s.time}
                </Text>
              ))}
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
        {(profileA.routine || profileB.routine) && (
          <View style={styles.row}>
            <View style={styles.col}>
              {profileA.routine && (
                <>
                  <Text style={styles.sectionTitle}>Routine</Text>
                  {profileA.routine.slots.map((slot, i) => (
                    <Text key={i}>
                      {slot.label}: {slot.hours}h
                    </Text>
                  ))}
                </>
              )}
            </View>
            <View style={styles.col}>
              {profileB.routine && (
                <>
                  <Text style={styles.sectionTitle}>Routine</Text>
                  {profileB.routine.slots.map((slot, i) => (
                    <Text key={i}>
                      {slot.label}: {slot.hours}h
                    </Text>
                  ))}
                </>
              )}
            </View>
          </View>
        )}
        {(profileA.favorites || profileB.favorites) && (
          <View style={styles.row}>
            <View style={styles.col}>
              {profileA.favorites && (
                <>
                  <Text style={styles.sectionTitle}>Favorites</Text>
                  {profileA.favorites.toyEntries.map((t, i) => (
                    <Text key={i}>Toy: {t.name}</Text>
                  ))}
                  {profileA.favorites.treatEntries.map((t, i) => (
                    <Text key={i}>
                      Treat: {t.brand} {t.flavor}
                    </Text>
                  ))}
                  {profileA.favorites.comfortItems.map((c, i) => (
                    <Text key={i}>Comfort: {c}</Text>
                  ))}
                  {profileA.favorites.favouriteSpots.map((s, i) => (
                    <Text key={i}>Spot: {s}</Text>
                  ))}
                </>
              )}
            </View>
            <View style={styles.col}>
              {profileB.favorites && (
                <>
                  <Text style={styles.sectionTitle}>Favorites</Text>
                  {profileB.favorites.toyEntries.map((t, i) => (
                    <Text key={i}>Toy: {t.name}</Text>
                  ))}
                  {profileB.favorites.treatEntries.map((t, i) => (
                    <Text key={i}>
                      Treat: {t.brand} {t.flavor}
                    </Text>
                  ))}
                  {profileB.favorites.comfortItems.map((c, i) => (
                    <Text key={i}>Comfort: {c}</Text>
                  ))}
                  {profileB.favorites.favouriteSpots.map((s, i) => (
                    <Text key={i}>Spot: {s}</Text>
                  ))}
                </>
              )}
            </View>
          </View>
        )}
        {(profileA.notes || profileB.notes) && (
          <View style={styles.row}>
            <View style={styles.col}>
              {profileA.notes && (
                <>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  {profileA.notes.specialNotes.map((note, i) => (
                    <View key={i}>
                      <Text>{note.title}</Text>
                      <Text>{note.body}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
            <View style={styles.col}>
              {profileB.notes && (
                <>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  {profileB.notes.specialNotes.map((note, i) => (
                    <View key={i}>
                      <Text>{note.title}</Text>
                      <Text>{note.body}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          </View>
        )}
        {footer}
      </Page>
    </Document>
  );
}
