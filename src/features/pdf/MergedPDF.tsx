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
import { isSharedVet } from "../../utils/isSharedVet";
import { GSection } from "./GSection";
import { EmergencyCallout } from "./EmergencyCallout";
import { MiniCard } from "./MiniCard";
import { Tag } from "./Tag";
import { RoutineClock } from "./RoutineClock";
import { colors, typeScale } from "./pdfTokens";

const CLOCK_SIZE = 156;
const THUMB_SIZE = 60;
const COVER_PHOTO_SIZE = 72;

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
  coverEyebrow: {
    color: colors.primaryInk,
    fontSize: typeScale.small.fontSize,
    fontWeight: typeScale.small.fontWeight as 400,
    marginBottom: 4,
  },
  coverCats: {
    flexDirection: "row",
    gap: 24,
  },
  catCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coverPhoto: {
    width: COVER_PHOTO_SIZE,
    height: COVER_PHOTO_SIZE,
    borderRadius: COVER_PHOTO_SIZE / 2,
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
  cmpRow: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },
  colDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  inlineText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    fontWeight: typeScale.body.fontWeight as 400,
    color: colors.ink,
    marginBottom: 3,
  },
  notAdded: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    fontStyle: "italic",
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  thumbnail: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginTop: 4,
  },
  noteItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: 10,
    marginBottom: 10,
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

interface MergedPDFProps {
  profileA: CatProfile;
  profileB: CatProfile;
  photoBlobUrls?: Record<string, string>;
}

function CatCoverCard({
  profile,
  photoBlobUrls,
}: {
  profile: CatProfile;
  photoBlobUrls: Record<string, string>;
}) {
  const { basics } = profile;
  const photoUrl = basics?.photoId ? photoBlobUrls[basics.photoId] : undefined;
  return (
    <View style={styles.catCard}>
      {photoUrl && <Image style={styles.coverPhoto} src={photoUrl} />}
      <View>
        <Text style={styles.catName}>{basics?.name ?? ""}</Text>
        {basics?.breed && <Text style={styles.catMeta}>{basics.breed}</Text>}
        {basics && (
          <Text style={styles.catMeta}>
            {formatAge(basics.ageValue, basics.ageUnit)}
          </Text>
        )}
      </View>
    </View>
  );
}

function CmpRow({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.cmpRow}>
      <View style={styles.col}>{left}</View>
      <View style={styles.colDivider} />
      <View style={styles.col}>{right}</View>
    </View>
  );
}

function NotAdded() {
  return <Text style={styles.notAdded}>Not added</Text>;
}

function FeedingCol({
  profile,
  photoBlobUrls,
}: {
  profile: CatProfile;
  photoBlobUrls: Record<string, string>;
}) {
  const { feeding } = profile;
  if (!feeding) return <NotAdded />;
  return (
    <>
      <View style={styles.row}>
        {feeding.servings.map((s, i) => (
          <Tag key={i} label={`${s.time} · ${s.grams}g`} />
        ))}
      </View>
      {feeding.foodEntries.map((entry, i) => (
        <MiniCard
          key={i}
          title={[entry.brand, entry.flavor].filter(Boolean).join(" · ")}
          subtitle={entry.texture}
        />
      ))}
      {feeding.platingInstructions && (
        <Text style={styles.inlineText}>{feeding.platingInstructions}</Text>
      )}
      {feeding.platingPhotoId && photoBlobUrls[feeding.platingPhotoId] && (
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
    </>
  );
}

function FavouritesCol({ profile }: { profile: CatProfile }) {
  const { favorites } = profile;
  if (!favorites) return <NotAdded />;
  return (
    <>
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
    </>
  );
}

function HealthCol({ profile }: { profile: CatProfile }) {
  const { medical } = profile;
  if (!medical) return <NotAdded />;
  const hasHealth =
    medical.medications.length > 0 ||
    !!medical.allergies ||
    !!medical.medicalConditions;
  if (!hasHealth) return <NotAdded />;
  return (
    <>
      {medical.medications.map((m, i) => (
        <MiniCard key={i} title={m.name} subtitle={m.dosage} />
      ))}
      {medical.allergies && (
        <Text style={styles.inlineText}>{medical.allergies}</Text>
      )}
      {medical.medicalConditions && (
        <Text style={styles.inlineText}>{medical.medicalConditions}</Text>
      )}
    </>
  );
}

function NotesCol({ profile }: { profile: CatProfile }) {
  const { notes } = profile;
  if (!notes || notes.specialNotes.length === 0) return <NotAdded />;
  return (
    <>
      {notes.specialNotes.map((note, i) => (
        <View key={i} style={styles.noteItem}>
          <Text style={styles.inlineText}>{note.title}</Text>
          <Text style={styles.inlineText}>{note.body}</Text>
        </View>
      ))}
    </>
  );
}

function hasHealthData(profile: CatProfile): boolean {
  const m = profile.medical;
  return (
    !!m && (m.medications.length > 0 || !!m.allergies || !!m.medicalConditions)
  );
}

function hasNotes(profile: CatProfile): boolean {
  return !!profile.notes && profile.notes.specialNotes.length > 0;
}

export default function MergedPDF({
  profileA,
  profileB,
  photoBlobUrls = {},
}: MergedPDFProps) {
  const vetA = profileA.medical?.vet;
  const vetB = profileB.medical?.vet;
  const shared = vetA && vetB ? isSharedVet(vetA, vetB) : false;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Band */}
        <View style={styles.coverBand}>
          <View>
            <Text style={styles.coverEyebrow}>Household Care Guide</Text>
          </View>
          <View style={styles.coverCats}>
            <CatCoverCard profile={profileA} photoBlobUrls={photoBlobUrls} />
            <CatCoverCard profile={profileB} photoBlobUrls={photoBlobUrls} />
          </View>
        </View>

        {/* Emergency Callout */}
        <EmergencyCallout
          mode="merged"
          vetA={vetA}
          vetB={vetB}
          emergencyContactsA={profileA.medical?.emergencyContacts ?? []}
          emergencyContactsB={profileB.medical?.emergencyContacts ?? []}
          sharedVet={shared}
        />

        {/* Feeding */}
        <GSection n={1} title="Feeding">
          <CmpRow
            left={
              <FeedingCol profile={profileA} photoBlobUrls={photoBlobUrls} />
            }
            right={
              <FeedingCol profile={profileB} photoBlobUrls={photoBlobUrls} />
            }
          />
        </GSection>

        {/* Routine */}
        <GSection n={2} title="Routine">
          <CmpRow
            left={
              profileA.routine ? (
                <RoutineClock
                  slots={profileA.routine.slots}
                  size={CLOCK_SIZE}
                />
              ) : (
                <NotAdded />
              )
            }
            right={
              profileB.routine ? (
                <RoutineClock
                  slots={profileB.routine.slots}
                  size={CLOCK_SIZE}
                />
              ) : (
                <NotAdded />
              )
            }
          />
        </GSection>

        {/* Favourites */}
        <GSection n={3} title="Favourites">
          <CmpRow
            left={<FavouritesCol profile={profileA} />}
            right={<FavouritesCol profile={profileB} />}
          />
        </GSection>

        {/* Health */}
        {(hasHealthData(profileA) || hasHealthData(profileB)) && (
          <GSection n={4} title="Health">
            <CmpRow
              left={<HealthCol profile={profileA} />}
              right={<HealthCol profile={profileB} />}
            />
          </GSection>
        )}

        {/* Good to Know */}
        {(hasNotes(profileA) || hasNotes(profileB)) && (
          <GSection n={5} title="Good to Know">
            <CmpRow
              left={<NotesCol profile={profileA} />}
              right={<NotesCol profile={profileB} />}
            />
          </GSection>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{`Made with PawBrief · caring for ${profileA.basics?.name ?? ""} & ${profileB.basics?.name ?? ""}`}</Text>
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
