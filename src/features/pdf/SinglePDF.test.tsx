import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CatProfile } from "../../types/profile";
import { buildMapsUrl } from "../../utils/buildMapsUrl";
import SinglePDF from "./SinglePDF";

vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Page: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Image: ({ src }: { src?: string }) => <img src={src ?? ""} alt="photo" />,
  Link: ({ children, src }: { children?: React.ReactNode; src?: string }) => (
    <a href={src}>{children}</a>
  ),
  Svg: ({ children }: { children?: React.ReactNode }) => <svg>{children}</svg>,
  Circle: () => null,
  Ellipse: () => null,
  G: ({ children }: { children?: React.ReactNode }) => <g>{children}</g>,
  Path: () => null,
  StyleSheet: { create: (s: unknown) => s },
  Font: { register: vi.fn() },
}));

const seedProfile: CatProfile = {
  id: "seed-id",
  completedSteps: [
    "basics",
    "feeding",
    "routine",
    "favorites",
    "medical",
    "notes",
  ],
  basics: {
    name: "Mochi",
    breed: "Scottish Fold",
    ageValue: 3,
    ageUnit: "years",
  },
  feeding: {
    foodEntries: [{ brand: "Royal Canin", flavor: "Chicken", texture: "Dry" }],
    servings: [{ time: "07:30", grams: 70 }],
    supplementEntries: [{ brand: "Zesty Paws", flavor: "Salmon Oil" }],
    platingInstructions: "Mix wet and dry food together",
    dietaryNotes: "",
  },
  routine: {
    slots: [{ label: "Sleep", start: "22:00", hours: 8, colorIndex: 0 }],
  },
  favorites: {
    toyEntries: [{ name: "Feather Wand" }],
    treatEntries: [{ brand: "Temptations", flavor: "Chicken" }],
    comfortItems: ["Blue blanket"],
    favouriteSpots: ["Sunny windowsill"],
  },
  medical: {
    vet: {
      name: "Dr Smith",
      clinicName: "Paws Clinic",
      phone: "555-1234",
      address: "123 Main St",
    },
    emergencyContacts: [
      { name: "Jane Doe", phone: "555-5678", relationship: "Friend" },
    ],
    medications: [
      {
        name: "Apoquel",
        dosage: "5mg",
        frequency: "Daily",
        instructions: "With food",
      },
    ],
    allergies: "Fish",
    medicalConditions: "None",
  },
  notes: {
    specialNotes: [{ title: "Hiding spots", body: "Check under the bed" }],
  },
  createdAt: 0,
  updatedAt: 0,
};

describe("SinglePDF", () => {
  describe("Cover Band", () => {
    it("renders the CARE GUIDE eyebrow label", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("CARE GUIDE")).toBeInTheDocument();
    });

    it("renders the cat name and breed · age on one line", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Mochi")).toBeInTheDocument();
      expect(
        screen.getByText(/Scottish Fold\s+·\s+3 years/)
      ).toBeInTheDocument();
    });

    it("renders PawBriefMark SVG fallback when no photo is provided", () => {
      const { container } = render(<SinglePDF profile={seedProfile} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders the cat photo when photoId and blob URL are provided", () => {
      const withPhoto: CatProfile = {
        ...seedProfile,
        basics: { ...seedProfile.basics!, photoId: "photo-abc" },
      };
      render(
        <SinglePDF
          profile={withPhoto}
          photoBlobUrls={{ "photo-abc": "blob:http://localhost/1" }}
        />
      );
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "blob:http://localhost/1"
      );
    });
  });

  describe("Emergency Callout", () => {
    it("renders the IN AN EMERGENCY header", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("IN AN EMERGENCY")).toBeInTheDocument();
    });

    it("renders vet name, clinic, and phone", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Dr Smith")).toBeInTheDocument();
      expect(screen.getByText("Paws Clinic")).toBeInTheDocument();
      expect(screen.getByText("555-1234")).toBeInTheDocument();
    });

    it("renders a Maps link to the vet address", () => {
      render(<SinglePDF profile={seedProfile} />);
      const mapsUrl = buildMapsUrl("123 Main St");
      expect(screen.getByRole("link")).toHaveAttribute("href", mapsUrl);
    });

    it("renders each emergency contact with name, phone, and relationship", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("555-5678")).toBeInTheDocument();
      expect(screen.getByText("Friend")).toBeInTheDocument();
    });
  });

  describe("Feeding section", () => {
    it("renders each serving entry formatted as 'HH:MM · Xg'", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("07:30 · 70g")).toBeInTheDocument();
    });

    it("renders SERVINGS eyebrow label", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("SERVINGS")).toBeInTheDocument();
    });

    it("renders food entry as 'Brand · Flavor' title with texture as subtitle", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Royal Canin · Chicken")).toBeInTheDocument();
      expect(screen.getByText("Dry")).toBeInTheDocument();
    });

    it("renders SUPPLEMENTS eyebrow and supplement entries", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("SUPPLEMENTS")).toBeInTheDocument();
      expect(screen.getByText("Zesty Paws · Salmon Oil")).toBeInTheDocument();
    });

    it("renders plating instructions with How to serve prefix", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("How to serve:")).toBeInTheDocument();
      expect(
        screen.getByText("Mix wet and dry food together")
      ).toBeInTheDocument();
    });

    it("renders dietary notes with warning prefix when present", () => {
      const withDietaryNotes: CatProfile = {
        ...seedProfile,
        feeding: { ...seedProfile.feeding!, dietaryNotes: "No fish" },
      };
      render(<SinglePDF profile={withDietaryNotes} />);
      expect(screen.getByText("No fish")).toBeInTheDocument();
    });
  });

  describe("Routine section", () => {
    it("renders the RoutineClock with clock-face time labels", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("00:00")).toBeInTheDocument();
      expect(screen.getByText("06:00")).toBeInTheDocument();
      expect(screen.getByText("12:00")).toBeInTheDocument();
      expect(screen.getByText("18:00")).toBeInTheDocument();
    });

    it("renders the legend with slot label and formatted time range", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Sleep")).toBeInTheDocument();
      expect(screen.getByText("22:00–06:00")).toBeInTheDocument();
    });
  });

  describe("Favourites section", () => {
    it("renders TOYS eyebrow and toy entries", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("TOYS")).toBeInTheDocument();
      expect(screen.getByText("Feather Wand")).toBeInTheDocument();
    });

    it("renders TREATS eyebrow and each treat entry formatted as 'Brand · Flavor'", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("TREATS")).toBeInTheDocument();
      expect(screen.getByText("Temptations · Chicken")).toBeInTheDocument();
    });

    it("renders COMFORT ITEMS eyebrow and comfort items as accent Tags", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("COMFORT ITEMS")).toBeInTheDocument();
      expect(screen.getByText("Blue blanket")).toBeInTheDocument();
    });

    it("renders FAVOURITE SPOTS eyebrow and favourite spots as accent Tags", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("FAVOURITE SPOTS")).toBeInTheDocument();
      expect(screen.getByText("Sunny windowsill")).toBeInTheDocument();
    });
  });

  describe("Health section", () => {
    it("renders MEDICATIONS eyebrow label", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("MEDICATIONS")).toBeInTheDocument();
    });

    it("renders medication card with name, dosage, and frequency joined", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Apoquel · 5mg · Daily")).toBeInTheDocument();
    });

    it("renders medication instructions as card subtitle", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("With food")).toBeInTheDocument();
    });

    it("renders ALLERGIES eyebrow and allergies text", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("ALLERGIES")).toBeInTheDocument();
      expect(screen.getByText("Fish")).toBeInTheDocument();
    });
  });

  describe("Good to Know section", () => {
    it("renders under a 'Good to Know' heading with note title and body", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(screen.getByText("Good to Know")).toBeInTheDocument();
      expect(screen.getByText("Hiding spots")).toBeInTheDocument();
      expect(screen.getByText("Check under the bed")).toBeInTheDocument();
    });
  });

  describe("Section omission", () => {
    it("omits feeding content when no feeding data is present", () => {
      render(<SinglePDF profile={{ ...seedProfile, feeding: undefined }} />);
      expect(screen.queryByText("Royal Canin")).not.toBeInTheDocument();
      expect(screen.queryByText("07:30 · 70g")).not.toBeInTheDocument();
    });
  });

  describe("Footer", () => {
    it("renders contextual copy naming the cat", () => {
      render(<SinglePDF profile={seedProfile} />);
      expect(
        screen.getByText(
          /made with pawbrief · keep this handy while caring for mochi/i
        )
      ).toBeInTheDocument();
    });
  });
});
