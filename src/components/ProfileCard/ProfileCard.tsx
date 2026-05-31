import Button from "../../primitives/Button/Button";
import Mark from "../../primitives/Mark/Mark";
import type { CatProfile } from "../../types/profile";
import { formatAge } from "../../utils/formatAge";
import { STEP_ORDER } from "../../utils/wizardSteps";
import {
  CardActions,
  CardBody,
  CardBreedAge,
  CardMeta,
  CardName,
  CardOuter,
  MergeCheck,
  PhotoImg,
  PhotoScrim,
  PhotoZone,
  StatusBadge,
} from "./ProfileCard.styles";

const editIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 2.5l2.5 2.5M9 4.5L3 10.5V13h2.5l6-6" />
  </svg>
);

const trashIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.5 9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-9" />
  </svg>
);

const checkIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="#fff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 7.5l3 3 6-7" />
  </svg>
);

interface ProfileCardProps {
  profile: CatProfile;
  photoUrl?: string;
  mergeMode: boolean;
  selected: boolean;
  selectable: boolean;
  onEdit: () => void;
  onAction: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

export default function ProfileCard({
  profile,
  photoUrl,
  mergeMode,
  selected,
  selectable,
  onEdit,
  onAction,
  onDelete,
  onSelect,
}: ProfileCardProps) {
  const isComplete = STEP_ORDER.every((s) =>
    profile.completedSteps.includes(s)
  );
  const basics = profile.basics;

  return (
    <CardOuter
      $selected={selected}
      $mergeMode={mergeMode}
      $selectable={selectable}
      onClick={mergeMode ? onSelect : undefined}
    >
      <PhotoZone>
        {photoUrl ? (
          <PhotoImg src={photoUrl} alt={basics?.name ?? "Cat photo"} />
        ) : (
          <Mark size={50} />
        )}
        {photoUrl && <PhotoScrim />}
        <StatusBadge $complete={isComplete}>
          {isComplete ? "Complete" : "Draft"}
        </StatusBadge>
        {mergeMode && selectable && (
          <MergeCheck
            $selected={selected}
            role="checkbox"
            aria-checked={selected}
            aria-label={basics?.name}
          >
            {selected && checkIcon}
          </MergeCheck>
        )}
      </PhotoZone>

      <CardBody>
        <CardName>{basics?.name ?? "Unnamed"}</CardName>
        {basics && (
          <CardBreedAge>
            {[basics.breed, formatAge(basics.ageValue, basics.ageUnit)]
              .filter(Boolean)
              .join(" · ")}
          </CardBreedAge>
        )}
        <CardMeta>
          {isComplete
            ? "Ready to print"
            : `Draft · ${profile.completedSteps.length} of 6 steps`}
        </CardMeta>
        {!mergeMode && (
          <CardActions>
            <Button
              kind="secondary"
              size="sm"
              onClick={onEdit}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {editIcon} Edit
            </Button>
            <div style={{ flex: 1 }}>
              <Button
                kind={isComplete ? "primary" : "secondary"}
                size="sm"
                style={{ width: "100%" }}
                onClick={onAction}
              >
                {isComplete ? "Generate PDF" : "Continue"}
              </Button>
            </div>
            <Button
              kind="secondary"
              size="sm"
              iconOnly
              title={`Delete ${basics?.name ?? "profile"}`}
              onClick={onDelete}
            >
              {trashIcon}
            </Button>
          </CardActions>
        )}
      </CardBody>
    </CardOuter>
  );
}
