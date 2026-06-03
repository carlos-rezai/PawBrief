import Button from "../../primitives/Button/Button";
import Mark from "../../primitives/Mark/Mark";
import { IconCheck, IconEdit, IconTrash } from "../../primitives/icons";
import type { CatProfile } from "../../types/profile";
import { formatAge } from "../../utils/formatAge";
import { STEP_ORDER } from "../../utils/wizardSteps";
import {
  ActionFlexItem,
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
        <StatusBadge $complete={isComplete} $onPhoto={!!photoUrl}>
          {isComplete ? "Complete" : "Draft"}
        </StatusBadge>
        {mergeMode && selectable && (
          <MergeCheck
            $selected={selected}
            role="checkbox"
            aria-checked={selected}
            aria-label={basics?.name}
          >
            {selected && <IconCheck />}
          </MergeCheck>
        )}
      </PhotoZone>

      <CardBody>
        <CardName>{basics?.name || "—"}</CardName>
        <CardBreedAge>
          {basics
            ? [basics.breed, formatAge(basics.ageValue, basics.ageUnit)]
                .filter(Boolean)
                .join(" · ") || " "
            : " "}
        </CardBreedAge>
        {!isComplete && (
          <CardMeta>
            Draft · {profile.completedSteps.length} of 6 steps
          </CardMeta>
        )}
        {!mergeMode && (
          <CardActions>
            <Button kind="secondary" size="sm" onClick={onEdit}>
              <IconEdit size={14} /> Edit
            </Button>
            <ActionFlexItem>
              <Button
                kind={isComplete ? "primary" : "secondary"}
                size="sm"
                onClick={onAction}
              >
                {isComplete ? "Generate PDF" : "Continue"}
              </Button>
            </ActionFlexItem>
            <Button
              kind="secondary"
              size="sm"
              iconOnly
              title={`Delete ${basics?.name ?? "profile"}`}
              onClick={onDelete}
            >
              <IconTrash size={15} />
            </Button>
          </CardActions>
        )}
      </CardBody>
    </CardOuter>
  );
}
