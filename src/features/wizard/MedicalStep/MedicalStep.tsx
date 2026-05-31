import { useState } from "react";
import type {
  MedicalData,
  VetInfo,
  EmergencyContact,
  Medication,
} from "../../../types/profile";
import { buildMapsUrl } from "../../../utils/buildMapsUrl";
import { Button, Field, Input, Textarea } from "../../../primitives";
import { IconPlus, IconX } from "../../../primitives/icons";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";
import StepSection from "../StepSection";
import {
  AddEntryButton,
  EntryCard,
  EntryHeader,
  EntryLabel,
  RemoveButton,
} from "../StepEntry.styles";
import {
  ContactGrid,
  HealthGrid,
  MedTopGrid,
  PrivacyNote,
  VetGrid,
} from "./MedicalStep.styles";

interface MedicalStepProps {
  onSave?: (data: MedicalData) => void;
  onBack?: () => void;
  initialData?: MedicalData;
  backLabel?: React.ReactNode;
  submitLabel?: React.ReactNode;
}

const emptyVet: VetInfo = { name: "", clinicName: "", phone: "", address: "" };

export default function MedicalStep({
  onSave,
  onBack,
  initialData,
  backLabel = "Back",
  submitLabel = "Next",
}: MedicalStepProps) {
  const [vet, setVet] = useState<VetInfo>(initialData?.vet ?? emptyVet);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >(initialData?.emergencyContacts ?? []);
  const [medications, setMedications] = useState<Medication[]>(
    initialData?.medications ?? []
  );
  const [allergies, setAllergies] = useState(initialData?.allergies ?? "");
  const [medicalConditions, setMedicalConditions] = useState(
    initialData?.medicalConditions ?? ""
  );

  const mapsUrl = buildMapsUrl(vet.address);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({
      vet,
      emergencyContacts,
      medications,
      allergies,
      medicalConditions,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepSection first title="Vet">
        <VetGrid>
          <Field label="Vet name">
            <Input
              value={vet.name}
              onChange={(e) => setVet((v) => ({ ...v, name: e.target.value }))}
            />
          </Field>
          <Field label="Clinic name">
            <Input
              value={vet.clinicName}
              onChange={(e) =>
                setVet((v) => ({ ...v, clinicName: e.target.value }))
              }
            />
          </Field>
        </VetGrid>
        <VetGrid>
          <Field label="Phone">
            <Input
              value={vet.phone}
              onChange={(e) => setVet((v) => ({ ...v, phone: e.target.value }))}
            />
          </Field>
          <Field label="Vet address">
            <Input
              value={vet.address}
              onChange={(e) =>
                setVet((v) => ({ ...v, address: e.target.value }))
              }
            />
          </Field>
        </VetGrid>
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            Get directions
          </a>
        )}
        <PrivacyNote>
          The address is only used to generate a 'Get directions' link in the
          guide. Your home address is never stored.
        </PrivacyNote>
      </StepSection>

      <StepSection title="Emergency contacts">
        {emergencyContacts.map((contact, i) => (
          <EntryCard key={i} data-testid="emergency-contact">
            <EntryHeader>
              <EntryLabel>Contact {i + 1}</EntryLabel>
              <RemoveButton
                type="button"
                title="Remove emergency contact"
                onClick={() =>
                  setEmergencyContacts((prev) =>
                    prev.filter((_, idx) => idx !== i)
                  )
                }
              >
                <IconX />
              </RemoveButton>
            </EntryHeader>
            <ContactGrid>
              <Field label="Name">
                <Input
                  value={contact.name}
                  onChange={(e) =>
                    setEmergencyContacts((prev) =>
                      prev.map((c, idx) =>
                        idx === i ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={contact.phone}
                  onChange={(e) =>
                    setEmergencyContacts((prev) =>
                      prev.map((c, idx) =>
                        idx === i ? { ...c, phone: e.target.value } : c
                      )
                    )
                  }
                />
              </Field>
              <Field label="Relationship">
                <Input
                  value={contact.relationship}
                  onChange={(e) =>
                    setEmergencyContacts((prev) =>
                      prev.map((c, idx) =>
                        idx === i ? { ...c, relationship: e.target.value } : c
                      )
                    )
                  }
                />
              </Field>
            </ContactGrid>
          </EntryCard>
        ))}
        <AddEntryButton
          type="button"
          onClick={() =>
            setEmergencyContacts((prev) => [
              ...prev,
              { name: "", phone: "", relationship: "" },
            ])
          }
        >
          <IconPlus size={14} /> Add emergency contact
        </AddEntryButton>
      </StepSection>

      <StepSection
        title="Medications"
        hint="Prescribed treatments — name, dosage, frequency, how to give it."
      >
        {medications.map((med, i) => (
          <EntryCard key={i} data-testid="medication">
            <EntryHeader>
              <EntryLabel>Medication {i + 1}</EntryLabel>
              <RemoveButton
                type="button"
                title="Remove medication"
                onClick={() =>
                  setMedications((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <IconX />
              </RemoveButton>
            </EntryHeader>
            <MedTopGrid>
              <Field label="Name">
                <Input
                  value={med.name}
                  onChange={(e) =>
                    setMedications((prev) =>
                      prev.map((m, idx) =>
                        idx === i ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                />
              </Field>
              <Field label="Dosage">
                <Input
                  value={med.dosage}
                  onChange={(e) =>
                    setMedications((prev) =>
                      prev.map((m, idx) =>
                        idx === i ? { ...m, dosage: e.target.value } : m
                      )
                    )
                  }
                />
              </Field>
              <Field label="Frequency">
                <Input
                  value={med.frequency}
                  onChange={(e) =>
                    setMedications((prev) =>
                      prev.map((m, idx) =>
                        idx === i ? { ...m, frequency: e.target.value } : m
                      )
                    )
                  }
                />
              </Field>
            </MedTopGrid>
            <Field label="Instructions">
              <Textarea
                value={med.instructions}
                onChange={(e) =>
                  setMedications((prev) =>
                    prev.map((m, idx) =>
                      idx === i ? { ...m, instructions: e.target.value } : m
                    )
                  )
                }
              />
            </Field>
          </EntryCard>
        ))}
        <AddEntryButton
          type="button"
          onClick={() =>
            setMedications((prev) => [
              ...prev,
              { name: "", dosage: "", frequency: "", instructions: "" },
            ])
          }
        >
          <IconPlus size={14} /> Add medication
        </AddEntryButton>
      </StepSection>

      <StepSection title="Health notes">
        <HealthGrid>
          <Field label="Allergies" optional>
            <Textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </Field>
          <Field label="Medical conditions" optional>
            <Textarea
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
            />
          </Field>
        </HealthGrid>
      </StepSection>

      <StepFooter>
        <Button onClick={onBack}>{backLabel}</Button>
        <StepFooterSpacer />
        <Button type="submit" kind="primary">
          {submitLabel}
        </Button>
      </StepFooter>
    </form>
  );
}
