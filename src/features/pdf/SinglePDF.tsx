import "./pdfFonts";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CatProfile } from "../../types/profile";
import { buildMapsUrl } from "../../utils/buildMapsUrl";
import { formatAge } from "../../utils/formatAge";
import { GSection } from "./GSection";
import { MiniCard } from "./MiniCard";
import { Tag } from "./Tag";
import { RoutineClock } from "./RoutineClock";
import { colors, typeScale } from "./pdfTokens";

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingHorizontal: 40,
    paddingBottom: 48,
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    backgroundColor: colors.bg,
  },
  coverBand: {
    backgroundColor: colors.primary,
    marginHorizontal: -40,
    paddingVertical: 28,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  coverText: {
    marginLeft: 16,
  },
  catName: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.display.fontSize,
    fontWeight: typeScale.display.fontWeight as 800,
    color: colors.surface,
  },
  catMeta: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    fontWeight: typeScale.body.fontWeight as 400,
    color: colors.primaryInk,
  },
  inlineText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    fontWeight: typeScale.body.fontWeight as 400,
    color: colors.ink,
    marginBottom: 3,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  noteItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: typeScale.caption.fontSize,
    color: colors.muted,
  },
});

interface SinglePDFProps {
  profile: CatProfile;
  photoBlobUrls?: Record<string, string>;
}

export default function SinglePDF({
  profile,
  photoBlobUrls = {},
}: SinglePDFProps) {
  const { basics, feeding, routine, favorites, medical, notes } = profile;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Band */}
        <View style={styles.coverBand}>
          {basics?.photoId && photoBlobUrls[basics.photoId] ? (
            <Image style={styles.photo} src={photoBlobUrls[basics.photoId]} />
          ) : null}
          <View style={styles.coverText}>
            <Text style={styles.catName}>{basics?.name ?? ""}</Text>
            {basics?.breed && (
              <Text style={styles.catMeta}>{basics.breed}</Text>
            )}
            {basics && (
              <Text style={styles.catMeta}>
                {formatAge(basics.ageValue, basics.ageUnit)}
              </Text>
            )}
          </View>
        </View>

        {/* Emergency Callout */}
        {medical && (
          <GSection n={1} title="Emergency">
            <Text style={styles.inlineText}>{medical.vet.name}</Text>
            <Text style={styles.inlineText}>{medical.vet.clinicName}</Text>
            <Text style={styles.inlineText}>{medical.vet.phone}</Text>
            {medical.vet.address && (
              <Link src={buildMapsUrl(medical.vet.address)}>
                Get directions
              </Link>
            )}
            {medical.emergencyContacts.map((c, i) => (
              <View key={i} style={{ marginTop: 8 }}>
                <Text style={styles.inlineText}>{c.name}</Text>
                <Text style={styles.inlineText}>{c.phone}</Text>
                <Text style={styles.inlineText}>{c.relationship}</Text>
              </View>
            ))}
          </GSection>
        )}

        {/* Feeding */}
        {feeding && (
          <GSection n={2} title="Feeding">
            <View style={styles.row}>
              {feeding.servings.map((s, i) => (
                <Tag key={i} label={`${s.time} · ${s.grams}g`} />
              ))}
            </View>
            {feeding.foodEntries.map((entry, i) => (
              <View key={i}>
                <MiniCard title={entry.brand} subtitle={entry.flavor} />
                <Tag label={entry.texture} />
              </View>
            ))}
            {feeding.platingInstructions && (
              <Text style={styles.inlineText}>
                {feeding.platingInstructions}
              </Text>
            )}
            {feeding.platingPhotoId &&
              photoBlobUrls[feeding.platingPhotoId] && (
                <Image
                  style={styles.thumbnail}
                  src={photoBlobUrls[feeding.platingPhotoId]}
                />
              )}
            {feeding.supplementEntries.length > 0 && (
              <View style={{ marginTop: 8 }}>
                {feeding.supplementEntries.map((s, i) => (
                  <MiniCard key={i} title={s.brand} subtitle={s.flavor} />
                ))}
              </View>
            )}
          </GSection>
        )}

        {/* Routine */}
        {routine && (
          <GSection n={3} title="Routine">
            <RoutineClock slots={routine.slots} />
          </GSection>
        )}

        {/* Favourites */}
        {favorites && (
          <GSection n={4} title="Favourites">
            {favorites.toyEntries.map((t, i) => (
              <MiniCard key={i} title={t.name} />
            ))}
            <View style={styles.row}>
              {favorites.treatEntries.map((t, i) => (
                <Tag key={i} label={`${t.brand} · ${t.flavor}`} />
              ))}
            </View>
            {favorites.comfortItems.map((item, i) => (
              <Text key={i} style={styles.inlineText}>
                {item}
              </Text>
            ))}
            {favorites.favouriteSpots.map((spot, i) => (
              <Text key={i} style={styles.inlineText}>
                {spot}
              </Text>
            ))}
          </GSection>
        )}

        {/* Health */}
        {medical && (
          <GSection n={5} title="Health">
            {medical.medications.map((m, i) => (
              <MiniCard key={i} title={m.name} subtitle={m.dosage} />
            ))}
            {medical.allergies && (
              <Text style={styles.inlineText}>{medical.allergies}</Text>
            )}
            {medical.medicalConditions && (
              <Text style={styles.inlineText}>{medical.medicalConditions}</Text>
            )}
          </GSection>
        )}

        {/* Good to Know */}
        {notes && notes.specialNotes.length > 0 && (
          <GSection n={6} title="Good to Know">
            {notes.specialNotes.map((note, i) => (
              <View key={i} style={styles.noteItem}>
                <Text style={styles.inlineText}>{note.title}</Text>
                <Text style={styles.inlineText}>{note.body}</Text>
                {note.photoId && photoBlobUrls[note.photoId] && (
                  <Image
                    style={styles.thumbnail}
                    src={photoBlobUrls[note.photoId]}
                  />
                )}
              </View>
            ))}
          </GSection>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Made with PawBrief</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
