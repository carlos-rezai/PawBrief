import { View, Text, Link } from "@react-pdf/renderer";
import type { VetInfo, EmergencyContact } from "../../types/profile";
import { buildMapsUrl } from "../../utils/buildMapsUrl";
import { colors, typeScale } from "./pdfTokens";

interface EmergencyCalloutSingleProps {
  mode: "single";
  vet: VetInfo;
  emergencyContacts: EmergencyContact[];
}

interface EmergencyCalloutMergedProps {
  mode: "merged";
  vetA: VetInfo | undefined;
  vetB: VetInfo | undefined;
  emergencyContactsA: EmergencyContact[];
  emergencyContactsB: EmergencyContact[];
  sharedVet: boolean;
}

type EmergencyCalloutProps =
  | EmergencyCalloutSingleProps
  | EmergencyCalloutMergedProps;

function Eyebrow({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontFamily: "Plus Jakarta Sans",
        fontSize: typeScale.caption.fontSize,
        fontWeight: 700,
        color: colors.muted,
        letterSpacing: 0.8,
        marginBottom: 4,
      }}
    >
      {label.toUpperCase()}
    </Text>
  );
}

function VetBlock({ vet }: { vet: VetInfo }) {
  return (
    <View>
      <Text
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontSize: typeScale.body.fontSize,
          fontWeight: 700,
          color: colors.ink,
          marginBottom: 2,
        }}
      >
        {vet.clinicName ? `${vet.name} · ${vet.clinicName}` : vet.name}
      </Text>
      {vet.phone ? (
        <Text
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: typeScale.body.fontSize,
            fontWeight: 700,
            color: colors.primary,
            marginBottom: 2,
          }}
        >
          {vet.phone}
        </Text>
      ) : null}
      {vet.address ? (
        <Text
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: 8.5,
            color: colors.inkSoft,
            lineHeight: 1.4,
          }}
        >
          {vet.address} ·{" "}
          <Link
            src={buildMapsUrl(vet.address)}
            style={{
              color: colors.accent,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Get directions ›
          </Link>
        </Text>
      ) : null}
    </View>
  );
}

function ContactsBlock({ contacts }: { contacts: EmergencyContact[] }) {
  return (
    <View>
      {contacts.map((c, i) => (
        <View key={i} style={{ marginBottom: 5 }}>
          <Text
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: typeScale.body.fontSize,
              marginBottom: 1,
            }}
          >
            <Text style={{ fontWeight: 700, color: colors.ink }}>{c.name}</Text>
            {c.relationship ? (
              <Text
                style={{ fontWeight: 400, color: colors.muted }}
              >{`  ·  ${c.relationship}`}</Text>
            ) : null}
          </Text>
          <Text
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: typeScale.body.fontSize,
              fontWeight: 700,
              color: colors.primary,
            }}
          >
            {c.phone}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SharedVetNote() {
  return (
    <Text
      style={{
        fontFamily: "Plus Jakarta Sans",
        fontSize: typeScale.caption.fontSize,
        fontWeight: 400,
        color: colors.muted,
        marginTop: 4,
      }}
    >
      Shared vet for both cats
    </Text>
  );
}

export function EmergencyCallout(props: EmergencyCalloutProps) {
  return (
    <View
      wrap={false}
      style={{
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: 9,
        overflow: "hidden",
        marginTop: 18,
      }}
    >
      {/* Header strip — round the top corners so the fill follows the
          1.5px rounded border (react-pdf's overflow:hidden does not clip
          a child's square corners to the parent radius). */}
      <View
        style={{
          backgroundColor: colors.primarySoft,
          paddingVertical: 5,
          paddingHorizontal: 12,
          borderTopLeftRadius: 7.5,
          borderTopRightRadius: 7.5,
        }}
      >
        <Text
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: typeScale.caption.fontSize,
            fontWeight: 800,
            color: colors.primary,
            letterSpacing: 1,
          }}
        >
          IN AN EMERGENCY
        </Text>
      </View>

      {props.mode === "single" ? (
        <View style={{ flexDirection: "row", padding: 11 }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Eyebrow label="Veterinarian" />
            <VetBlock vet={props.vet} />
          </View>
          {props.emergencyContacts.length > 0 ? (
            <View
              style={{
                flex: 1,
                paddingLeft: 12,
                borderLeftWidth: 1,
                borderLeftColor: colors.border,
              }}
            >
              <Eyebrow label="Contacts" />
              <ContactsBlock contacts={props.emergencyContacts} />
            </View>
          ) : null}
        </View>
      ) : (
        <View>
          {/* Shared vet runs full-width above the two contact columns */}
          {props.sharedVet && props.vetA ? (
            <View
              style={{
                paddingHorizontal: 12,
                paddingTop: 11,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Eyebrow label="Veterinarian" />
              <VetBlock vet={props.vetA} />
              <SharedVetNote />
            </View>
          ) : null}

          <View style={{ flexDirection: "row", padding: 11 }}>
            <View
              style={{
                flex: 1,
                paddingRight: 12,
                borderRightWidth: 1,
                borderRightColor: colors.border,
              }}
            >
              {!props.sharedVet && props.vetA ? (
                <View style={{ marginBottom: 8 }}>
                  <Eyebrow label="Veterinarian" />
                  <VetBlock vet={props.vetA} />
                </View>
              ) : null}
              {props.emergencyContactsA.length > 0 ? (
                <View>
                  <Eyebrow label="Contacts" />
                  <ContactsBlock contacts={props.emergencyContactsA} />
                </View>
              ) : null}
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              {!props.sharedVet && props.vetB ? (
                <View style={{ marginBottom: 8 }}>
                  <Eyebrow label="Veterinarian" />
                  <VetBlock vet={props.vetB} />
                </View>
              ) : null}
              {props.emergencyContactsB.length > 0 ? (
                <View>
                  <Eyebrow label="Contacts" />
                  <ContactsBlock contacts={props.emergencyContactsB} />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
