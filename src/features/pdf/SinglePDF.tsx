import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
  Font,
  Svg,
  Circle,
  G,
} from "@react-pdf/renderer";
import type { CatProfile } from "../../types/profile";
import { buildMapsUrl } from "../../utils/buildMapsUrl";
import { formatAge } from "../../utils/formatAge";

Font.register({
  family: "Helvetica",
  src: "https://fonts.gstatic.com/s/helveticaneue/v1/Helvetica.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica", fontSize: 10 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  catName: { fontSize: 18, fontWeight: "bold" },
  section: { marginBottom: 12 },
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
  photo: { width: "100%", marginBottom: 8 },
});

const pdfColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
];

interface PieChartProps {
  slots: { label: string; hours: number }[];
}

function PieChart({ slots }: PieChartProps) {
  const total = slots.reduce((s, sl) => s + sl.hours, 0);
  if (total === 0) return null;

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  let cumulative = 0;
  const slices = slots.map((slot, i) => {
    const fraction = slot.hours / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += fraction;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = fraction > 0.5 ? 1 : 0;

    return {
      key: i,
      cx,
      cy,
      x1,
      y1,
      x2,
      y2,
      largeArc,
      color: pdfColors[i % pdfColors.length],
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G>
        {slices.map((s) => (
          <Circle
            key={s.key}
            cx={s.cx}
            cy={s.cy}
            r={r}
            fill={s.color}
            stroke="white"
            strokeWidth={1}
          />
        ))}
      </G>
    </Svg>
  );
}

interface SinglePDFProps {
  profile: CatProfile;
  photoBlobUrls?: Record<string, string>;
}

export default function SinglePDF({
  profile,
  photoBlobUrls = {},
}: SinglePDFProps) {
  const { basics, feeding, routine, favorites, medical, notes } = profile;

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
          <Text style={styles.catName}>{basics?.name ?? "Cat Profile"}</Text>
        </View>
        {basics?.photoId && photoBlobUrls[basics.photoId] && (
          <Image style={styles.photo} src={photoBlobUrls[basics.photoId]} />
        )}
        {basics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basics</Text>
            <Text>Name: {basics.name}</Text>
            {basics.breed && <Text>Breed: {basics.breed}</Text>}
            <Text>Age: {formatAge(basics.ageValue, basics.ageUnit)}</Text>
          </View>
        )}
        {feeding && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feeding</Text>
            {feeding.foodEntries.map((entry, i) => (
              <Text key={i}>
                {entry.brand} — {entry.flavor} ({entry.texture})
              </Text>
            ))}
            <Text>Serving: {feeding.servingGrams}g</Text>
            <Text>Times: {feeding.feedingTimes.join(", ")}</Text>
            {feeding.platingInstructions && (
              <Text>Instructions: {feeding.platingInstructions}</Text>
            )}
            {feeding.platingPhotoId &&
              photoBlobUrls[feeding.platingPhotoId] && (
                <Image
                  style={styles.photo}
                  src={photoBlobUrls[feeding.platingPhotoId]}
                />
              )}
          </View>
        )}
        {routine && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Routine</Text>
            <PieChart slots={routine.slots} />
            {routine.slots.map((slot, i) => (
              <Text key={i}>
                {slot.label}: {slot.hours}h
              </Text>
            ))}
          </View>
        )}
        {favorites && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            {favorites.toyEntries.map((t, i) => (
              <Text key={i}>
                Toy: {t.name}
                {t.description ? ` — ${t.description}` : ""}
              </Text>
            ))}
            {favorites.treatEntries.map((t, i) => (
              <Text key={i}>
                Treat: {t.brand} {t.flavor}
              </Text>
            ))}
          </View>
        )}
        {medical && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical</Text>
            <Text>Vet: {medical.vet.name}</Text>
            <Text>Clinic: {medical.vet.clinicName}</Text>
            <Text>Phone: {medical.vet.phone}</Text>
            {medical.vet.address && (
              <Link src={buildMapsUrl(medical.vet.address)}>
                Get directions to {medical.vet.clinicName}
              </Link>
            )}
            {medical.medications.map((m, i) => (
              <Text key={i}>
                {m.name} {m.dosage} — {m.frequency}
              </Text>
            ))}
          </View>
        )}
        {notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {notes.specialNotes.map((note, i) => (
              <View key={i}>
                <Text>{note.title}</Text>
                <Text>{note.body}</Text>
                {note.photoId && photoBlobUrls[note.photoId] && (
                  <Image
                    style={styles.photo}
                    src={photoBlobUrls[note.photoId]}
                  />
                )}
              </View>
            ))}
          </View>
        )}
        {footer}
      </Page>
    </Document>
  );
}
