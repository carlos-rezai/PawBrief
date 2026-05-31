import { useState } from "react";
import type {
  MedicalData,
  VetInfo,
  EmergencyContact,
  Medication,
} from "../../../types/profile";
import { buildMapsUrl } from "../../../utils/buildMapsUrl";
import { Button, Field, Input, Textarea } from "../../../primitives";
import { StepFooter, StepFooterSpacer } from "../StepFooter.styles";

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
      <Field label="Phone">
        <Input
          value={vet.phone}
          onChange={(e) => setVet((v) => ({ ...v, phone: e.target.value }))}
        />
      </Field>
      <Field label="Vet address">
        <Input
          value={vet.address}
          onChange={(e) => setVet((v) => ({ ...v, address: e.target.value }))}
        />
      </Field>
      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
      )}

      {emergencyContacts.map((contact, i) => (
        <div key={i} data-testid="emergency-contact">
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
          <Button
            onClick={() =>
              setEmergencyContacts((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove emergency contact
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          setEmergencyContacts((prev) => [
            ...prev,
            { name: "", phone: "", relationship: "" },
          ])
        }
      >
        Add emergency contact
      </Button>

      {medications.map((med, i) => (
        <div key={i} data-testid="medication">
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
          <Button
            onClick={() =>
              setMedications((prev) => prev.filter((_, idx) => idx !== i))
            }
          >
            Remove medication
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          setMedications((prev) => [
            ...prev,
            { name: "", dosage: "", frequency: "", instructions: "" },
          ])
        }
      >
        Add medication
      </Button>

      <Field label="Allergies">
        <Textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />
      </Field>

      <Field label="Medical conditions">
        <Textarea
          value={medicalConditions}
          onChange={(e) => setMedicalConditions(e.target.value)}
        />
      </Field>

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
