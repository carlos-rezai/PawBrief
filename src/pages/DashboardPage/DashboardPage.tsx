import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "../../features/profile";
import { Button, Checkbox } from "../../primitives";
import Wordmark from "../../primitives/Wordmark/Wordmark";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { useToast } from "../../components/Toast/Toast";
import type { CatProfile } from "../../types/profile";
import { getNextStep } from "../../utils/getNextStep";
import { STEP_ORDER } from "../../utils/wizardSteps";
import {
  DashContent,
  DashHeader,
  DashHeaderLeft,
  DashHeaderSubtitle,
  DashHeaderTitle,
  DashNavbar,
  DashNavbarInner,
} from "./DashboardPage.styles";

const mergeIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 3v3a4 4 0 0 0 4 4h6M4 15v-3a4 4 0 0 1 4-4M12 7l3 3-3 3" />
  </svg>
);

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
      <DashNavbar>
        <DashNavbarInner>
          <Wordmark />
        </DashNavbarInner>
      </DashNavbar>
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
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                {mergeIcon} Merge guides
              </Button>
            )}
          </div>
        </DashHeader>
        {profiles.length === 0 ? (
          <p>Get started — create your first profile above.</p>
        ) : (
          <ul>
            {profiles.map((profile) => {
              const isComplete = STEP_ORDER.every((s) =>
                profile.completedSteps.includes(s)
              );
              const basics = profile.basics;
              return (
                <li key={profile.id}>
                  {mergeMode && isComplete && (
                    <Checkbox
                      aria-label={basics?.name}
                      checked={selectedIds.includes(profile.id)}
                      onChange={() => toggleMergeSelect(profile.id)}
                    />
                  )}
                  {basics && (
                    <>
                      <p>{basics.name}</p>
                      {basics.breed && <p>{basics.breed}</p>}
                      <p>
                        {basics.ageValue} {basics.ageUnit}
                      </p>
                    </>
                  )}
                  {isComplete ? (
                    <>
                      <Button
                        onClick={() =>
                          navigate(`/wizard/${profile.id}/step/basics`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => navigate(`/preview/${profile.id}`)}
                      >
                        Generate PDF
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        const nextStep = getNextStep(profile);
                        if (nextStep)
                          navigate(`/wizard/${profile.id}/step/${nextStep}`);
                      }}
                    >
                      Continue
                    </Button>
                  )}
                  <Button onClick={() => setPendingDelete(profile)}>
                    Delete
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
        <button onClick={handleCreateProfile}>New cat profile</button>
      </DashContent>

      {mergeMode && (
        <div>
          <span>{selectedIds.length} selected</span>
          <Button
            disabled={selectedIds.length !== 2}
            onClick={() => {
              if (selectedIds.length === 2) {
                navigate(`/preview/merge/${selectedIds[0]}/${selectedIds[1]}`);
              }
            }}
          >
            Create merged guide
          </Button>
        </div>
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
