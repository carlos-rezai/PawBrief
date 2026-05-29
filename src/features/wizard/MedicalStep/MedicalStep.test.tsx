import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MedicalStep from "./MedicalStep";
import type { MedicalData } from "../../../types/profile";

function renderMedicalStep(onSave = vi.fn()) {
  render(<MedicalStep onSave={onSave} />);
}

describe("MedicalStep vet fields", () => {
  it("renders vet name, clinic name, phone, and address fields", () => {
    renderMedicalStep();
    expect(screen.getByLabelText(/vet name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clinic name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vet address/i)).toBeInTheDocument();
  });

  it("shows a Maps URL preview link beneath the address field when text is entered", async () => {
    const user = userEvent.setup();
    renderMedicalStep();
    await user.type(
      screen.getByLabelText(/vet address/i),
      "123 Main St, Springfield"
    );
    const link = await screen.findByRole("link", { name: /get directions/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps")
    );
  });
});

describe("MedicalStep emergency contacts", () => {
  it("clicking Add emergency contact appends a row with Name, Phone, and Relationship fields", async () => {
    const user = userEvent.setup();
    renderMedicalStep();
    await user.click(
      screen.getByRole("button", { name: /add emergency contact/i })
    );
    const entry = screen.getByTestId("emergency-contact");
    expect(within(entry).getByLabelText(/name/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/phone/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/relationship/i)).toBeInTheDocument();
  });

  it("clicking Remove emergency contact removes it", async () => {
    const user = userEvent.setup();
    renderMedicalStep();
    await user.click(
      screen.getByRole("button", { name: /add emergency contact/i })
    );
    await user.click(
      screen.getByRole("button", { name: /remove emergency contact/i })
    );
    expect(screen.queryAllByTestId("emergency-contact")).toHaveLength(0);
  });
});

describe("MedicalStep medications", () => {
  it("clicking Add medication appends a row with Name, Dosage, Frequency, and Instructions fields", async () => {
    const user = userEvent.setup();
    renderMedicalStep();
    await user.click(screen.getByRole("button", { name: /add medication/i }));
    const entry = screen.getByTestId("medication");
    expect(within(entry).getByLabelText(/name/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/dosage/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/frequency/i)).toBeInTheDocument();
    expect(within(entry).getByLabelText(/instructions/i)).toBeInTheDocument();
  });

  it("clicking Remove medication removes it", async () => {
    const user = userEvent.setup();
    renderMedicalStep();
    await user.click(screen.getByRole("button", { name: /add medication/i }));
    await user.click(
      screen.getByRole("button", { name: /remove medication/i })
    );
    expect(screen.queryAllByTestId("medication")).toHaveLength(0);
  });
});

describe("MedicalStep allergies and medical conditions", () => {
  it("renders allergies and medical conditions text fields", () => {
    renderMedicalStep();
    expect(screen.getByLabelText(/allergies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/medical conditions/i)).toBeInTheDocument();
  });
});

describe("MedicalStep onSave", () => {
  it("calls onSave with vet, emergencyContacts, medications, allergies, and medicalConditions", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<MedicalStep onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0] as MedicalData;
    expect(saved).toHaveProperty("vet");
    expect(saved).toHaveProperty("emergencyContacts");
    expect(saved).toHaveProperty("medications");
    expect(saved).toHaveProperty("allergies");
    expect(saved).toHaveProperty("medicalConditions");
  });
});

describe("MedicalStep initialData", () => {
  it("pre-fills vet name from initialData", () => {
    const initialData: MedicalData = {
      vet: {
        name: "Dr. Smith",
        clinicName: "City Vet Clinic",
        phone: "555-1234",
        address: "456 Elm St",
      },
      emergencyContacts: [],
      medications: [],
    };
    render(<MedicalStep initialData={initialData} />);
    expect(screen.getByDisplayValue("Dr. Smith")).toBeInTheDocument();
  });
});
