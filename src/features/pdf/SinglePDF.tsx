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
import { colors, typeScale, palette as routinePalette } from "./pdfTokens";
import { formatRange } from "../../utils/formatRange";

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    backgroundColor: colors.surface,
  },
  coverBand: {
    backgroundColor: colors.primary,
    marginHorizontal: -30,
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coverLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    objectFit: "cover",
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
    marginBottom: 3,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  wordmarkText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
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
    fontSize: 10.5,
    fontWeight: 400,
    color: colors.primaryInk,
  },
  eyebrow: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.caption.fontSize,
    fontWeight: 700,
    color: colors.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  inlineText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: typeScale.body.fontSize,
    fontWeight: typeScale.body.fontWeight as 400,
    color: colors.ink,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  favGroup: {
    marginBottom: 11,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  noteItem: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginTop: 3,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 30,
    right: 30,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
                <PawBriefMark size={36} />
              )}
            </View>
            <View style={styles.coverText}>
              <Text style={styles.coverEyebrow}>CARE GUIDE</Text>
              <Text style={styles.catName}>{basics?.name ?? ""}</Text>
              {basics && (
                <Text style={styles.catMeta}>
                  {[basics.breed, formatAge(basics.ageValue, basics.ageUnit)]
                    .filter(Boolean)
                    .join("  ·  ")}
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.wordmark, { alignSelf: "flex-start" }]}>
            <PawBriefMark size={17} reverse />
            <Text style={styles.wordmarkText}>
              Paw
              <Text style={{ color: colors.primarySoft, fontWeight: 800 }}>
                Brief
              </Text>
            </Text>
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
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* LEFT: food cards + plating */}
              <View style={{ flex: 1, gap: 5 }}>
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
          <GSection n={2} title="A typical day">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RoutineClock slots={routine.slots} size={140} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                {(() => {
                  const sorted = [...routine.slots]
                    .filter((s) => s.start != null)
                    .sort((a, b) => a.start.localeCompare(b.start));
                  const mid = Math.ceil(sorted.length / 2);
                  const left = sorted.slice(0, mid);
                  const right = sorted.slice(mid);
                  return (
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <View style={{ flex: 1 }}>
                        {left.map((slot, i) => (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 6,
                              gap: 6,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                backgroundColor:
                                  routinePalette[
                                    slot.colorIndex % routinePalette.length
                                  ],
                              }}
                            />
                            <View>
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
                      <View style={{ flex: 1 }}>
                        {right.map((slot, i) => (
                          <View
                            key={i}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 6,
                              gap: 6,
                            }}
                          >
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                backgroundColor:
                                  routinePalette[
                                    slot.colorIndex % routinePalette.length
                                  ],
                              }}
                            />
                            <View>
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
                    </View>
                  );
                })()}
              </View>
            </View>
          </GSection>
        )}

        {/* Favourites */}
        {favorites && (
          <GSection n={3} title="Favourites">
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* LEFT: toys */}
              <View style={{ flex: 1 }}>
                {favorites.toyEntries.length > 0 && (
                  <>
                    <Text style={styles.eyebrow}>TOYS</Text>
                    <View style={{ gap: 5 }}>
                      {favorites.toyEntries.map((t, i) => (
                        <MiniCard
                          key={i}
                          title={t.name}
                          subtitle={t.description}
                        />
                      ))}
                    </View>
                  </>
                )}
              </View>
              {/* RIGHT: treats, comfort items, favourite spots */}
              <View style={{ flex: 1 }}>
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
              </View>
            </View>
          </GSection>
        )}

        {/* Health */}
        {medical && (
          <GSection n={4} title="Health">
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* LEFT: medications */}
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>MEDICATIONS</Text>
                {medical.medications.length > 0 ? (
                  medical.medications.map((m, i) => (
                    <MiniCard
                      key={i}
                      title={[m.name, m.dosage, m.frequency]
                        .filter(Boolean)
                        .join(" · ")}
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
              </View>
              {/* RIGHT: allergies + conditions */}
              <View style={{ flex: 1 }}>
                {medical.allergies && (
                  <>
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
                  </>
                )}
                {medical.medicalConditions && (
                  <>
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
                  </>
                )}
              </View>
            </View>
          </GSection>
        )}

        {/* Good to Know */}
        {notes && notes.specialNotes.length > 0 && (
          <GSection n={5} title="Good to know">
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
