import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CatProfile } from "../../types/profile";
import MergedPDF from "./MergedPDF";

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

const profileA: CatProfile = {
  id: "profile-a",
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
    platingInstructions: "Mix wet and dry",
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
    medicalConditions: "",
  },
  notes: {
    specialNotes: [{ title: "Hiding spots", body: "Check under the bed" }],
  },
  createdAt: 0,
  updatedAt: 0,
};

// Same vet as profileA — triggers shared vet detection
const sharedVetProfileB: CatProfile = {
  id: "profile-b-shared",
  completedSteps: [
    "basics",
    "feeding",
    "routine",
    "favorites",
    "medical",
    "notes",
  ],
  basics: {
    name: "Luna",
    breed: "Ragdoll",
    ageValue: 2,
    ageUnit: "years",
  },
  feeding: {
    foodEntries: [{ brand: "Iams", flavor: "Tuna", texture: "Wet" }],
    servings: [{ time: "08:00", grams: 60 }],
    supplementEntries: [],
    platingInstructions: "Serve at room temperature",
    dietaryNotes: "",
  },
  routine: {
    slots: [{ label: "Play", start: "10:00", hours: 2, colorIndex: 1 }],
  },
  favorites: {
    toyEntries: [{ name: "Laser Pointer" }],
    treatEntries: [{ brand: "Wellness", flavor: "Tuna" }],
    comfortItems: ["Soft pillow"],
    favouriteSpots: ["Cat tree top"],
  },
  medical: {
    vet: {
      name: "Dr Smith",
      clinicName: "Paws Clinic",
      phone: "555-1234",
      address: "123 Main St",
    },
    emergencyContacts: [
      { name: "Bob Smith", phone: "555-8888", relationship: "Neighbour" },
    ],
    medications: [],
    allergies: "",
    medicalConditions: "",
  },
  notes: {
    specialNotes: [
      { title: "Favourite toys", body: "Loves the laser pointer" },
    ],
  },
  createdAt: 0,
  updatedAt: 0,
};

// Different vet from profileA — no shared vet
const differentVetProfileB: CatProfile = {
  ...sharedVetProfileB,
  id: "profile-b-diff",
  medical: {
    ...sharedVetProfileB.medical!,
    vet: {
      name: "Dr Jones",
      clinicName: "Cat Care Clinic",
      phone: "555-9999",
      address: "456 Oak Ave",
    },
  },
};

describe("MergedPDF", () => {
  describe("Cover Band", () => {
    it("renders 'Household Care Guide' eyebrow label", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Household Care Guide")).toBeInTheDocument();
    });

    it("renders both cats' names, breeds, and formatted ages", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Mochi")).toBeInTheDocument();
      expect(screen.getByText("Scottish Fold")).toBeInTheDocument();
      expect(screen.getByText("3 years")).toBeInTheDocument();
      expect(screen.getByText("Luna")).toBeInTheDocument();
      expect(screen.getByText("Ragdoll")).toBeInTheDocument();
      expect(screen.getByText("2 years")).toBeInTheDocument();
    });

    it("renders both cat photos when photoIds and blob URLs are provided", () => {
      const withPhotos: [CatProfile, CatProfile] = [
        { ...profileA, basics: { ...profileA.basics!, photoId: "photo-a" } },
        {
          ...sharedVetProfileB,
          basics: { ...sharedVetProfileB.basics!, photoId: "photo-b" },
        },
      ];
      render(
        <MergedPDF
          profileA={withPhotos[0]}
          profileB={withPhotos[1]}
          photoBlobUrls={{
            "photo-a": "blob:http://localhost/a",
            "photo-b": "blob:http://localhost/b",
          }}
        />
      );
      const imgs = screen.getAllByRole("img");
      expect(imgs).toHaveLength(2);
      expect(imgs[0]).toHaveAttribute("src", "blob:http://localhost/a");
      expect(imgs[1]).toHaveAttribute("src", "blob:http://localhost/b");
    });

    it("renders PawBriefMark SVG fallbacks when photoIds are absent", () => {
      const { container } = render(
        <MergedPDF profileA={profileA} profileB={sharedVetProfileB} />
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(
        2
      );
    });
  });

  describe("Emergency Callout — shared vet", () => {
    it("renders the IN AN EMERGENCY header", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("IN AN EMERGENCY")).toBeInTheDocument();
    });

    it("renders the shared vet block with 'Shared vet for both cats' label", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Shared vet for both cats")).toBeInTheDocument();
      expect(screen.getByText("Dr Smith")).toBeInTheDocument();
      expect(screen.getByText("555-1234")).toBeInTheDocument();
    });

    it("renders each cat's emergency contacts independently", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    });
  });

  describe("Emergency Callout — different vets", () => {
    it("renders each vet in its own column", () => {
      render(<MergedPDF profileA={profileA} profileB={differentVetProfileB} />);
      expect(screen.getByText("Dr Smith")).toBeInTheDocument();
      expect(screen.getByText("Dr Jones")).toBeInTheDocument();
    });

    it("does not render 'Shared vet for both cats' label", () => {
      render(<MergedPDF profileA={profileA} profileB={differentVetProfileB} />);
      expect(
        screen.queryByText("Shared vet for both cats")
      ).not.toBeInTheDocument();
    });
  });

  describe("Feeding section", () => {
    it("renders serving entries formatted as 'HH:MM · Xg' for each cat", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("07:30 · 70g")).toBeInTheDocument();
      expect(screen.getByText("08:00 · 60g")).toBeInTheDocument();
    });

    it("renders SERVINGS eyebrow labels", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getAllByText("SERVINGS")).toHaveLength(2);
    });

    it("renders food entries as 'Brand · Flavor' for each cat", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Royal Canin · Chicken")).toBeInTheDocument();
      expect(screen.getByText("Iams · Tuna")).toBeInTheDocument();
    });

    it("shows 'Not added' in a column when that cat has no feeding data", () => {
      const noFeedingProfileB: CatProfile = {
        ...sharedVetProfileB,
        feeding: undefined,
      };
      render(<MergedPDF profileA={profileA} profileB={noFeedingProfileB} />);
      expect(screen.getAllByText("Not added").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Royal Canin · Chicken")).toBeInTheDocument();
    });
  });

  describe("Routine section", () => {
    it("renders clock-face time labels in both RoutineClock columns", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getAllByText("00:00")).toHaveLength(2);
      expect(screen.getAllByText("12:00")).toHaveLength(2);
    });

    it("renders slot legends with label and formatted time range for each cat", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Sleep")).toBeInTheDocument();
      expect(screen.getByText("22:00–06:00")).toBeInTheDocument();
      expect(screen.getByText("Play")).toBeInTheDocument();
      expect(screen.getByText("10:00–12:00")).toBeInTheDocument();
    });
  });

  describe("Favourites section", () => {
    it("renders TOYS eyebrow and toy entries from each cat", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getAllByText("TOYS")).toHaveLength(2);
      expect(screen.getByText("Feather Wand")).toBeInTheDocument();
      expect(screen.getByText("Laser Pointer")).toBeInTheDocument();
    });

    it("renders treats, comfort items as accent Tags, and favourite spots for each cat", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Temptations · Chicken")).toBeInTheDocument();
      expect(screen.getByText("Blue blanket")).toBeInTheDocument();
      expect(screen.getByText("Sunny windowsill")).toBeInTheDocument();
      expect(screen.getByText("Wellness · Tuna")).toBeInTheDocument();
      expect(screen.getByText("Soft pillow")).toBeInTheDocument();
      expect(screen.getByText("Cat tree top")).toBeInTheDocument();
    });
  });

  describe("Health section", () => {
    it("renders health section when at least one cat has health data", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Health")).toBeInTheDocument();
      expect(screen.getByText("Apoquel · 5mg · Daily")).toBeInTheDocument();
    });

    it("renders ALLERGIES eyebrow and allergies text", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("ALLERGIES")).toBeInTheDocument();
      expect(screen.getByText("Fish")).toBeInTheDocument();
    });

    it("shows 'Not added' in Health column when one cat has no health data", () => {
      const noHealthB: CatProfile = {
        ...sharedVetProfileB,
        medical: {
          ...sharedVetProfileB.medical!,
          medications: [],
          allergies: "",
          medicalConditions: "",
        },
      };
      render(<MergedPDF profileA={profileA} profileB={noHealthB} />);
      expect(screen.getAllByText("Not added").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Apoquel · 5mg · Daily")).toBeInTheDocument();
    });

    it("omits health section when neither cat has health data", () => {
      const noHealthA: CatProfile = {
        ...profileA,
        medical: {
          ...profileA.medical!,
          medications: [],
          allergies: "",
          medicalConditions: "",
        },
      };
      const noHealthB: CatProfile = {
        ...sharedVetProfileB,
        medical: {
          ...sharedVetProfileB.medical!,
          medications: [],
          allergies: "",
          medicalConditions: "",
        },
      };
      render(<MergedPDF profileA={noHealthA} profileB={noHealthB} />);
      expect(screen.queryByText("Health")).not.toBeInTheDocument();
    });
  });

  describe("Good to Know section", () => {
    it("renders notes section when at least one cat has notes", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(screen.getByText("Good to Know")).toBeInTheDocument();
      expect(screen.getByText("Hiding spots")).toBeInTheDocument();
      expect(screen.getByText("Favourite toys")).toBeInTheDocument();
    });

    it("shows 'Not added' in Notes column when one cat has no notes", () => {
      const noNotesB: CatProfile = {
        ...sharedVetProfileB,
        notes: { specialNotes: [] },
      };
      render(<MergedPDF profileA={profileA} profileB={noNotesB} />);
      expect(screen.getAllByText("Not added").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Hiding spots")).toBeInTheDocument();
    });

    it("omits notes section when neither cat has notes", () => {
      const noNotesA: CatProfile = { ...profileA, notes: { specialNotes: [] } };
      const noNotesB: CatProfile = {
        ...sharedVetProfileB,
        notes: { specialNotes: [] },
      };
      render(<MergedPDF profileA={noNotesA} profileB={noNotesB} />);
      expect(screen.queryByText("Good to Know")).not.toBeInTheDocument();
    });
  });

  describe("Footer", () => {
    it("renders contextual copy naming both cats", () => {
      render(<MergedPDF profileA={profileA} profileB={sharedVetProfileB} />);
      expect(
        screen.getByText(/made with pawbrief · caring for mochi & luna/i)
      ).toBeInTheDocument();
    });
  });
});
