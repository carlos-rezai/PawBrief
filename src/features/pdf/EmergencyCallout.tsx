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

const colDivider = {
  width: 1,
  backgroundColor: colors.border,
  marginHorizontal: 9,
};

export function EmergencyCallout(props: EmergencyCalloutProps) {
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: 9,
        overflow: "hidden",
        marginTop: 18,
      }}
    >
      {/* Header strip */}
      <View
        style={{
          backgroundColor: colors.primarySoft,
          paddingVertical: 5,
          paddingHorizontal: 11,
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

      {/* Body */}
      <View style={{ padding: 11 }}>
        {props.mode === "single" ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Eyebrow label="Veterinarian" />
              <VetBlock vet={props.vet} />
            </View>
            {props.emergencyContacts.length > 0 ? (
              <>
                <View style={colDivider} />
                <View style={{ flex: 1 }}>
                  <Eyebrow label="Contacts" />
                  <ContactsBlock contacts={props.emergencyContacts} />
                </View>
              </>
            ) : null}
          </View>
        ) : (
          <>
            {props.sharedVet && props.vetA ? (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: typeScale.small.fontSize,
                    fontWeight: 700,
                    color: colors.primary,
                    marginBottom: 4,
                  }}
                >
                  Shared vet for both cats
                </Text>
                <VetBlock vet={props.vetA} />
              </View>
            ) : null}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Eyebrow label="Contacts" />
                {!props.sharedVet && props.vetA ? (
                  <View style={{ marginBottom: 8 }}>
                    <VetBlock vet={props.vetA} />
                  </View>
                ) : null}
                <ContactsBlock contacts={props.emergencyContactsA} />
              </View>
              <View style={colDivider} />
              <View style={{ flex: 1 }}>
                <Eyebrow label="Contacts" />
                {!props.sharedVet && props.vetB ? (
                  <View style={{ marginBottom: 8 }}>
                    <VetBlock vet={props.vetB} />
                  </View>
                ) : null}
                <ContactsBlock contacts={props.emergencyContactsB} />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
