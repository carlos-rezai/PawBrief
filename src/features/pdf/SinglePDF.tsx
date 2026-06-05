import "./pdfFonts";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CatProfile } from "../../types/profile";
import { formatAge } from "../../utils/formatAge";
import { GSection } from "./GSection";
import { EmergencyCallout } from "./EmergencyCallout";
import { MiniCard } from "./MiniCard";
import { Tag } from "./Tag";
import { RoutineClock } from "./RoutineClock";
import { PawBriefMark } from "./PawBriefMark";
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
    justifyContent: "space-between",
  },
  coverLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  coverText: {
    marginLeft: 16,
  },
  coverEyebrow: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.caption.fontSize,
    fontWeight: typeScale.caption.fontWeight as 400,
    color: colors.primaryInk,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wordmarkText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontWeight: 800,
    color: colors.surface,
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
  eyebrow: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.caption.fontSize,
    fontWeight: 700,
    color: colors.muted,
    letterSpacing: 0.8,
    marginBottom: 4,
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
    borderLeftColor: colors.accent,
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
          <View style={styles.coverLeft}>
            <View style={styles.avatarCircle}>
              {basics?.photoId && photoBlobUrls[basics.photoId] ? (
                <Image
                  style={styles.photo}
                  src={photoBlobUrls[basics.photoId]}
                />
              ) : (
                <PawBriefMark size={46} />
              )}
            </View>
            <View style={styles.coverText}>
              <Text style={styles.coverEyebrow}>CARE GUIDE</Text>
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
          <View style={styles.wordmark}>
            <PawBriefMark size={22} reverse />
            <Text style={styles.wordmarkText}>PawBrief</Text>
          </View>
        </View>

        {/* Emergency Callout */}
        {medical && (
          <EmergencyCallout
            mode="single"
            vet={medical.vet}
            emergencyContacts={medical.emergencyContacts}
          />
        )}

        {/* Feeding */}
        {feeding && (
          <GSection n={1} title="Feeding">
            <View style={{ flexDirection: "row", gap: 16 }}>
              {/* LEFT: food cards + plating */}
              <View style={{ flex: 1, gap: 7 }}>
                {feeding.foodEntries.map((entry, i) => (
                  <MiniCard
                    key={i}
                    title={[entry.brand, entry.flavor]
                      .filter(Boolean)
                      .join(" · ")}
                    subtitle={entry.texture}
                  />
                ))}
                {feeding.platingInstructions && (
                  <Text style={styles.inlineText}>
                    <Text style={{ fontWeight: 700, color: colors.ink }}>
                      How to serve:{" "}
                    </Text>
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
              </View>
              {/* RIGHT: servings + supplements + dietary notes */}
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>SERVINGS</Text>
                <View style={styles.row}>
                  {feeding.servings.map((s, i) => (
                    <Tag key={i} label={`${s.time} · ${s.grams}g`} />
                  ))}
                </View>
                {feeding.supplementEntries.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.eyebrow}>SUPPLEMENTS</Text>
                    {feeding.supplementEntries.map((s, i) => (
                      <Text key={i} style={styles.inlineText}>
                        {[s.brand, s.flavor].filter(Boolean).join(" · ")}
                      </Text>
                    ))}
                  </View>
                )}
                {feeding.dietaryNotes && (
                  <Text style={{ ...styles.inlineText, marginTop: 8 }}>
                    <Text style={{ color: colors.accent, fontWeight: 700 }}>
                      ⚠{" "}
                    </Text>
                    {feeding.dietaryNotes}
                  </Text>
                )}
              </View>
            </View>
          </GSection>
        )}

        {/* Routine */}
        {routine && (
          <GSection n={2} title="Routine">
            <RoutineClock slots={routine.slots} />
          </GSection>
        )}

        {/* Favourites */}
        {favorites && (
          <GSection n={3} title="Favourites">
            {favorites.toyEntries.map((t, i) => (
              <MiniCard key={i} title={t.name} subtitle={t.description} />
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
          <GSection n={4} title="Health">
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
          <GSection n={5} title="Good to Know">
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
          <Text>{`Made with PawBrief · keep this handy while caring for ${basics?.name ?? ""}`}</Text>
          <Text>
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
