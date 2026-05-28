import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../features/profile";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading } = useProfile(id ?? "");

  useEffect(() => {
    if (!loading && profile === null) {
      navigate("/", { replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading) return null;

  return <main>Preview</main>;
}
