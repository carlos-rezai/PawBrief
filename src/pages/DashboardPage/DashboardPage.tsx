import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "../../features/profile";
import { Button } from "../../primitives";
import Mark from "../../primitives/Mark/Mark";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import Header from "../../components/Header/Header";
import { useToast } from "../../components/Toast/Toast";
import type { CatProfile } from "../../types/profile";
import { getNextStep } from "../../utils/getNextStep";
import { STEP_ORDER } from "../../utils/wizardSteps";
import { IconMerge } from "../../primitives/icons";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import PlusCard from "../../components/PlusCard/PlusCard";
import {
  CardGrid,
  DashContent,
  DashHeader,
  DashHeaderLeft,
  DashHeaderSubtitle,
  DashHeaderTitle,
  EmptyStateDesc,
  EmptyStateTitle,
  EmptyStateWrapper,
  MergeBar,
  MergeBarInner,
  MergeBarLeft,
  MergeCount,
  MergeHint,
} from "./DashboardPage.styles";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profiles, loaded, createProfile, deleteProfile } = useProfiles();
  const { enqueue } = useToast();
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<CatProfile | null>(null);

  const completeProfiles = profiles.filter((p) =>
    STEP_ORDER.every((s) => p.completedSteps.includes(s))
  );
  const canMerge = completeProfiles.length >= 2;

  function toggleMergeSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length < 2) {
        return [...prev, id];
      }
      return [prev[1], id];
    });
  }

  async function handleCreateProfile() {
    const id = await createProfile();
    navigate(`/wizard/${id}/step/basics`);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    const name = pendingDelete.basics?.name ?? "Profile";
    await deleteProfile(pendingDelete.id);
    setPendingDelete(null);
    enqueue(`${name} deleted`);
  }

  return (
    <>
      <Header />
      <DashContent>
        <DashHeader>
          <DashHeaderLeft>
            <DashHeaderTitle>
              {mergeMode ? "Select two cats to merge" : "Your cats"}
            </DashHeaderTitle>
            <DashHeaderSubtitle>
              {mergeMode
                ? "Their guides will sit side-by-side in one PDF."
                : `${profiles.length} profile${profiles.length !== 1 ? "s" : ""} · ${completeProfiles.length} ready to print`}
            </DashHeaderSubtitle>
          </DashHeaderLeft>
          <div>
            {mergeMode ? (
              <Button
                kind="secondary"
                onClick={() => {
                  setMergeMode(false);
                  setSelectedIds([]);
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                kind="secondary"
                disabled={!canMerge}
                onClick={() => {
                  setMergeMode(true);
                  setSelectedIds([]);
                }}
              >
                <IconMerge /> Merge guides
              </Button>
            )}
          </div>
        </DashHeader>
        {profiles.length === 0 ? (
          <EmptyStateWrapper>
            <Mark size={84} />
            <EmptyStateTitle>No care guides yet</EmptyStateTitle>
            <EmptyStateDesc>
              Create a profile for each cat, fill in the wizard, and generate a
              printable care guide to share with your sitter.
            </EmptyStateDesc>
            <Button kind="primary" size="lg" onClick={handleCreateProfile}>
              New cat profile
            </Button>
          </EmptyStateWrapper>
        ) : (
          <CardGrid>
            {profiles.map((profile) => {
              const isComplete = STEP_ORDER.every((s) =>
                profile.completedSteps.includes(s)
              );
              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  mergeMode={mergeMode}
                  selected={selectedIds.includes(profile.id)}
                  selectable={isComplete}
                  onEdit={() => navigate(`/wizard/${profile.id}/step/basics`)}
                  onAction={() => {
                    if (isComplete) {
                      navigate(`/preview/${profile.id}`);
                    } else {
                      const nextStep = getNextStep(profile);
                      if (nextStep)
                        navigate(`/wizard/${profile.id}/step/${nextStep}`);
                    }
                  }}
                  onDelete={() => setPendingDelete(profile)}
                  onSelect={() => toggleMergeSelect(profile.id)}
                />
              );
            })}
            {!mergeMode && <PlusCard onClick={handleCreateProfile} />}
          </CardGrid>
        )}
      </DashContent>

      {mergeMode && (
        <MergeBar>
          <MergeBarInner>
            <MergeBarLeft>
              <MergeCount>{selectedIds.length} of 2 selected</MergeCount>
              <MergeHint>
                {selectedIds.length === 2 ? "Ready" : "Pick one more"}
              </MergeHint>
            </MergeBarLeft>
            <Button
              kind={selectedIds.length === 2 ? "primary" : "disabled"}
              onClick={() => {
                if (selectedIds.length === 2) {
                  navigate(
                    `/preview/merge/${selectedIds[0]}/${selectedIds[1]}`
                  );
                }
              }}
            >
              Create merged guide
            </Button>
          </MergeBarInner>
        </MergeBar>
      )}

      {pendingDelete && (
        <ConfirmModal
          confirmLabel="Delete profile"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        >
          <p>
            Delete{" "}
            <strong>{pendingDelete.basics?.name ?? "this profile"}</strong>?
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
