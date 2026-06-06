import "./pdfFonts";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  CatProfile,
  ActivitySlot,
  FeedingData,
  FavoritesData,
  MedicalData,
} from "../../types/profile";
import { formatAge } from "../../utils/formatAge";
import { isSharedVet } from "../../utils/isSharedVet";
import { GSection } from "./GSection";
import { EmergencyCallout } from "./EmergencyCallout";
import { MiniCard } from "./MiniCard";
import { Tag } from "./Tag";
import { RoutineClock } from "./RoutineClock";
import { PawBriefMark } from "./PawBriefMark";
import { colors, typeScale, palette as routinePalette } from "./pdfTokens";
import { formatRange } from "../../utils/formatRange";

const CLOCK_SIZE = 116;
const THUMB_SIZE = 100;
const COVER_PHOTO_SIZE = 44;

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    backgroundColor: colors.surface,
  },
  coverBand: {
    backgroundColor: colors.primary,
    marginHorizontal: -24,
    paddingTop: 15,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  coverTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  coverEyebrow: {
    color: colors.primaryInk,
    fontSize: 8.25,
    fontWeight: 700,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  coverCatsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  catHead: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catHeadLeft: {
    paddingRight: 15,
  },
  catHeadRight: {
    paddingLeft: 15,
    borderLeftWidth: 1,
    // 30% white over the primary band (rgba() renders incorrectly in react-pdf)
    borderLeftColor: "#BC846B",
  },
  avatarCircle: {
    width: COVER_PHOTO_SIZE,
    height: COVER_PHOTO_SIZE,
    borderRadius: COVER_PHOTO_SIZE / 2,
    backgroundColor: colors.primarySoft,
    borderWidth: 2.5,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  coverPhoto: {
    // Fill the circle's content box exactly so the white border is even all
    // around (a fixed size equal to the bordered box overflows asymmetrically).
    width: "100%",
    height: "100%",
    borderRadius: COVER_PHOTO_SIZE / 2,
    objectFit: "cover",
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wordmarkText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    fontWeight: 800,
    color: colors.surface,
  },
  catName: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.title.fontSize,
    fontWeight: 800,
    color: colors.surface,
  },
  catMeta: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 9.5,
    fontWeight: 400,
    color: colors.primaryInk,
  },
  cmpRow: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colDivider: {
    width: 1,
    backgroundColor: colors.border,
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
  notAdded: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  favGroup: {
    marginBottom: 11,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  thumbnail: {
    // Width only — height is derived from the image's aspect ratio so the
    // plating photo is never squashed into a square.
    width: THUMB_SIZE,
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
    bottom: 12,
    left: 24,
    right: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  position,
}: {
  profile: CatProfile;
  photoBlobUrls: Record<string, string>;
  position: "left" | "right";
}) {
  const { basics } = profile;
  const photoUrl = basics?.photoId ? photoBlobUrls[basics.photoId] : undefined;
  return (
    <View
      style={[
        styles.catHead,
        position === "right" ? styles.catHeadRight : styles.catHeadLeft,
      ]}
    >
      <View style={styles.avatarCircle}>
        {photoUrl ? (
          <Image style={styles.coverPhoto} src={photoUrl} />
        ) : (
          <PawBriefMark size={22} />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.catName}>{basics?.name ?? ""}</Text>
        {basics && (
          <Text style={styles.catMeta}>
            {[basics.breed, formatAge(basics.ageValue, basics.ageUnit)]
              .filter(Boolean)
              .join(" · ")}
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
    <View wrap={false} style={styles.cmpRow}>
      <View style={styles.col}>{left}</View>
      <View style={styles.colDivider} />
      <View style={styles.col}>{right}</View>
    </View>
  );
}

type AlignedRow = { left: React.ReactNode; right: React.ReactNode };

/**
 * Renders a comparison section as a stack of subsection rows so the same
 * subsection (e.g. SERVINGS) lines up horizontally on both sides even when the
 * two cats have different amounts of content above it. Rows touch with no gap
 * so the centre divider stays continuous; inter-subsection spacing lives inside
 * the cells via paddingTop.
 */
function AlignedSection({
  rows,
  gap = 8,
}: {
  rows: AlignedRow[];
  gap?: number;
}) {
  const visible = rows.filter((r) => r.left || r.right);
  return (
    <View>
      {visible.map((r, i) => {
        const cellStyle =
          i > 0 ? [styles.col, { paddingTop: gap }] : styles.col;
        return (
          <View key={i} wrap={false} style={styles.cmpRow}>
            <View style={cellStyle}>{r.left}</View>
            <View style={styles.colDivider} />
            <View style={cellStyle}>{r.right}</View>
          </View>
        );
      })}
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
      <View style={{ gap: 5 }}>
        {feeding.foodEntries.map((entry, i) => (
          <MiniCard
            key={i}
            title={[entry.brand, entry.flavor].filter(Boolean).join(" · ")}
            subtitle={entry.texture}
          />
        ))}
      </View>
      {feeding.servings.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.eyebrow}>SERVINGS</Text>
          <View style={styles.row}>
            {feeding.servings.map((s, i) => (
              <Tag key={i} label={`${s.time} · ${s.grams}g`} />
            ))}
          </View>
        </View>
      )}
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
      {(feeding.platingInstructions ||
        (feeding.platingPhotoId && photoBlobUrls[feeding.platingPhotoId])) && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.eyebrow}>HOW TO SERVE</Text>
          {feeding.platingInstructions && (
            <Text style={styles.inlineText}>{feeding.platingInstructions}</Text>
          )}
          {feeding.platingPhotoId && photoBlobUrls[feeding.platingPhotoId] && (
            <Image
              style={styles.thumbnail}
              src={photoBlobUrls[feeding.platingPhotoId]}
            />
          )}
        </View>
      )}
      {feeding.dietaryNotes && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.eyebrow}>DIETARY NOTES</Text>
          <Text style={styles.inlineText}>{feeding.dietaryNotes}</Text>
        </View>
      )}
    </>
  );
}

function feedingFood(feeding: FeedingData) {
  if (feeding.foodEntries.length === 0) return null;
  return (
    <View style={{ gap: 5 }}>
      {feeding.foodEntries.map((entry, i) => (
        <MiniCard
          key={i}
          title={[entry.brand, entry.flavor].filter(Boolean).join(" · ")}
          subtitle={entry.texture}
        />
      ))}
    </View>
  );
}

function feedingServings(feeding: FeedingData) {
  if (feeding.servings.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>SERVINGS</Text>
      <View style={styles.row}>
        {feeding.servings.map((s, i) => (
          <Tag key={i} label={`${s.time} · ${s.grams}g`} />
        ))}
      </View>
    </View>
  );
}

function feedingSupplements(feeding: FeedingData) {
  if (feeding.supplementEntries.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>SUPPLEMENTS</Text>
      {feeding.supplementEntries.map((s, i) => (
        <Text key={i} style={styles.inlineText}>
          {[s.brand, s.flavor].filter(Boolean).join(" · ")}
        </Text>
      ))}
    </View>
  );
}

function feedingHowToServe(
  feeding: FeedingData,
  photoBlobUrls: Record<string, string>
) {
  const platingUrl = feeding.platingPhotoId
    ? photoBlobUrls[feeding.platingPhotoId]
    : undefined;
  if (!feeding.platingInstructions && !platingUrl) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>HOW TO SERVE</Text>
      {!!feeding.platingInstructions && (
        <Text style={styles.inlineText}>{feeding.platingInstructions}</Text>
      )}
      {platingUrl && <Image style={styles.thumbnail} src={platingUrl} />}
    </View>
  );
}

function feedingDietary(feeding: FeedingData) {
  if (!feeding.dietaryNotes) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>DIETARY NOTES</Text>
      <Text style={styles.inlineText}>{feeding.dietaryNotes}</Text>
    </View>
  );
}

function FeedingSection({
  profileA,
  profileB,
  photoBlobUrls,
}: {
  profileA: CatProfile;
  profileB: CatProfile;
  photoBlobUrls: Record<string, string>;
}) {
  const a = profileA.feeding;
  const b = profileB.feeding;
  if (!a || !b) {
    return (
      <CmpRow
        left={<FeedingCol profile={profileA} photoBlobUrls={photoBlobUrls} />}
        right={<FeedingCol profile={profileB} photoBlobUrls={photoBlobUrls} />}
      />
    );
  }
  const rows: AlignedRow[] = [
    { left: feedingFood(a), right: feedingFood(b) },
    { left: feedingServings(a), right: feedingServings(b) },
    { left: feedingSupplements(a), right: feedingSupplements(b) },
    {
      left: feedingHowToServe(a, photoBlobUrls),
      right: feedingHowToServe(b, photoBlobUrls),
    },
    { left: feedingDietary(a), right: feedingDietary(b) },
  ];
  return <AlignedSection rows={rows} />;
}

function FavouritesCol({ profile }: { profile: CatProfile }) {
  const { favorites } = profile;
  if (!favorites) return <NotAdded />;
  return (
    <>
      {favorites.toyEntries.length > 0 && (
        <View style={styles.favGroup}>
          <Text style={styles.eyebrow}>TOYS</Text>
          <View style={{ gap: 5 }}>
            {favorites.toyEntries.map((t, i) => (
              <MiniCard key={i} title={t.name} subtitle={t.description} />
            ))}
          </View>
        </View>
      )}
      {favorites.treatEntries.length > 0 && (
        <View style={styles.favGroup}>
          <Text style={styles.eyebrow}>TREATS</Text>
          <View style={styles.tagRow}>
            {favorites.treatEntries.map((t, i) => (
              <Tag key={i} label={`${t.brand} · ${t.flavor}`} />
            ))}
          </View>
        </View>
      )}
      {favorites.comfortItems.length > 0 && (
        <View style={styles.favGroup}>
          <Text style={styles.eyebrow}>COMFORT ITEMS</Text>
          <View style={styles.tagRow}>
            {favorites.comfortItems.map((item, i) => (
              <Tag key={i} label={item} variant="accent" />
            ))}
          </View>
        </View>
      )}
      {favorites.favouriteSpots.length > 0 && (
        <View style={styles.favGroup}>
          <Text style={styles.eyebrow}>FAVOURITE SPOTS</Text>
          <View style={styles.tagRow}>
            {favorites.favouriteSpots.map((spot, i) => (
              <Tag key={i} label={spot} variant="accent" />
            ))}
          </View>
        </View>
      )}
    </>
  );
}

function favToys(fav: FavoritesData) {
  if (fav.toyEntries.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>TOYS</Text>
      <View style={{ gap: 5 }}>
        {fav.toyEntries.map((t, i) => (
          <MiniCard key={i} title={t.name} subtitle={t.description} />
        ))}
      </View>
    </View>
  );
}

function favTreats(fav: FavoritesData) {
  if (fav.treatEntries.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>TREATS</Text>
      <View style={styles.tagRow}>
        {fav.treatEntries.map((t, i) => (
          <Tag key={i} label={`${t.brand} · ${t.flavor}`} />
        ))}
      </View>
    </View>
  );
}

function favComfort(fav: FavoritesData) {
  if (fav.comfortItems.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>COMFORT ITEMS</Text>
      <View style={styles.tagRow}>
        {fav.comfortItems.map((item, i) => (
          <Tag key={i} label={item} variant="accent" />
        ))}
      </View>
    </View>
  );
}

function favSpots(fav: FavoritesData) {
  if (fav.favouriteSpots.length === 0) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>FAVOURITE SPOTS</Text>
      <View style={styles.tagRow}>
        {fav.favouriteSpots.map((spot, i) => (
          <Tag key={i} label={spot} variant="accent" />
        ))}
      </View>
    </View>
  );
}

function FavouritesSection({
  profileA,
  profileB,
}: {
  profileA: CatProfile;
  profileB: CatProfile;
}) {
  const a = profileA.favorites;
  const b = profileB.favorites;
  if (!a || !b) {
    return (
      <CmpRow
        left={<FavouritesCol profile={profileA} />}
        right={<FavouritesCol profile={profileB} />}
      />
    );
  }
  const rows: AlignedRow[] = [
    { left: favToys(a), right: favToys(b) },
    { left: favTreats(a), right: favTreats(b) },
    { left: favComfort(a), right: favComfort(b) },
    { left: favSpots(a), right: favSpots(b) },
  ];
  return <AlignedSection rows={rows} gap={11} />;
}

function RoutineCol({ slots }: { slots: ActivitySlot[] }) {
  const sorted = [...slots]
    .filter((s) => s.start != null)
    .sort((a, b) => a.start.localeCompare(b.start));
  return (
    <>
      <View style={{ alignItems: "center" }}>
        <RoutineClock slots={slots} size={CLOCK_SIZE} />
      </View>
      <View style={{ marginTop: 8 }}>
        {sorted.map((slot, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
              gap: 5,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor:
                  routinePalette[slot.colorIndex % routinePalette.length],
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 6,
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
                {slot.label}
              </Text>
              <Text
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: typeScale.caption.fontSize,
                  color: colors.muted,
                }}
              >
                {formatRange(slot.start, slot.hours)}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
      <Text style={styles.eyebrow}>MEDICATIONS</Text>
      {medical.medications.length > 0 ? (
        medical.medications.map((m, i) => (
          <MiniCard
            key={i}
            title={[m.name, m.dosage, m.frequency].filter(Boolean).join(" · ")}
            subtitle={m.instructions || undefined}
          />
        ))
      ) : (
        <Text
          style={{
            ...styles.inlineText,
            color: colors.muted,
          }}
        >
          None
        </Text>
      )}
      {medical.allergies && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.eyebrow}>ALLERGIES</Text>
          <Text
            style={{
              ...styles.inlineText,
              color: colors.accent,
              fontWeight: 700,
            }}
          >
            {medical.allergies}
          </Text>
        </View>
      )}
      {medical.medicalConditions && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.eyebrow}>CONDITIONS</Text>
          <Text
            style={{
              ...styles.inlineText,
              color: colors.inkSoft,
              fontWeight: 600,
            }}
          >
            {medical.medicalConditions}
          </Text>
        </View>
      )}
    </>
  );
}

function healthMeds(medical: MedicalData) {
  return (
    <View>
      <Text style={styles.eyebrow}>MEDICATIONS</Text>
      {medical.medications.length > 0 ? (
        medical.medications.map((m, i) => (
          <MiniCard
            key={i}
            title={[m.name, m.dosage, m.frequency].filter(Boolean).join(" · ")}
            subtitle={m.instructions || undefined}
          />
        ))
      ) : (
        <Text style={{ ...styles.inlineText, color: colors.muted }}>None</Text>
      )}
    </View>
  );
}

function healthAllergies(medical: MedicalData) {
  if (!medical.allergies) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>ALLERGIES</Text>
      <Text
        style={{ ...styles.inlineText, color: colors.accent, fontWeight: 700 }}
      >
        {medical.allergies}
      </Text>
    </View>
  );
}

function healthConditions(medical: MedicalData) {
  if (!medical.medicalConditions) return null;
  return (
    <View>
      <Text style={styles.eyebrow}>CONDITIONS</Text>
      <Text
        style={{ ...styles.inlineText, color: colors.inkSoft, fontWeight: 600 }}
      >
        {medical.medicalConditions}
      </Text>
    </View>
  );
}

function HealthSection({
  profileA,
  profileB,
}: {
  profileA: CatProfile;
  profileB: CatProfile;
}) {
  const a = profileA.medical;
  const b = profileB.medical;
  if (!a || !b || !hasHealthData(profileA) || !hasHealthData(profileB)) {
    return (
      <CmpRow
        left={<HealthCol profile={profileA} />}
        right={<HealthCol profile={profileB} />}
      />
    );
  }
  const rows: AlignedRow[] = [
    { left: healthMeds(a), right: healthMeds(b) },
    { left: healthAllergies(a), right: healthAllergies(b) },
    { left: healthConditions(a), right: healthConditions(b) },
  ];
  return <AlignedSection rows={rows} />;
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
          <View style={styles.coverTopRow}>
            <Text style={styles.coverEyebrow}>Household Care Guide</Text>
            <View style={styles.wordmark}>
              <PawBriefMark size={17} reverse />
              <Text style={styles.wordmarkText}>
                Paw
                <Text style={{ color: colors.primarySoft, fontWeight: 800 }}>
                  Brief
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.coverCatsRow}>
            <CatCoverCard
              profile={profileA}
              photoBlobUrls={photoBlobUrls}
              position="left"
            />
            <CatCoverCard
              profile={profileB}
              photoBlobUrls={photoBlobUrls}
              position="right"
            />
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

        {/* Routine */}
        <GSection n={1} title="A typical day">
          <CmpRow
            left={
              profileA.routine ? (
                <RoutineCol slots={profileA.routine.slots} />
              ) : (
                <NotAdded />
              )
            }
            right={
              profileB.routine ? (
                <RoutineCol slots={profileB.routine.slots} />
              ) : (
                <NotAdded />
              )
            }
          />
        </GSection>

        {/* Feeding */}
        <GSection n={2} title="Feeding">
          <FeedingSection
            profileA={profileA}
            profileB={profileB}
            photoBlobUrls={photoBlobUrls}
          />
        </GSection>

        {/* Favourites */}
        <GSection n={3} title="Favourites">
          <FavouritesSection profileA={profileA} profileB={profileB} />
        </GSection>

        {/* Health */}
        {(hasHealthData(profileA) || hasHealthData(profileB)) && (
          <GSection n={4} title="Health">
            <HealthSection profileA={profileA} profileB={profileB} />
          </GSection>
        )}

        {/* Good to Know */}
        {(hasNotes(profileA) || hasNotes(profileB)) && (
          <GSection n={5} title="Good to know">
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
