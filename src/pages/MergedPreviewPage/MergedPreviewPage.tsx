import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile } from "../../features/profile";
import MergedPDF from "../../features/pdf/MergedPDF";
import { Button } from "../../primitives";

export default function MergedPreviewPage() {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>();
  const navigate = useNavigate();
  const { profile: profileA, loading: loadingA } = useProfile(id1 ?? "");
  const { profile: profileB, loading: loadingB } = useProfile(id2 ?? "");

  useEffect(() => {
    if (!loadingA && !loadingB && (profileA === null || profileB === null)) {
      navigate("/", { replace: true });
    }
  }, [loadingA, loadingB, profileA, profileB, navigate]);

  if (loadingA || loadingB) return null;
  if (!profileA || !profileB) return null;

  const fileName = `${profileA.basics?.name ?? "cat"}-${profileB.basics?.name ?? "cat"}-care-guide.pdf`;
  const mergeReturnTo = `merge/${id1}/${id2}`;

  return (
    <main>
      <PDFDownloadLink
        document={<MergedPDF profileA={profileA} profileB={profileB} />}
        fileName={fileName}
      >
        {({ loading: pdfLoading }) => (
          <Button disabled={pdfLoading}>Download PDF</Button>
        )}
      </PDFDownloadLink>
      <Button
        onClick={() =>
          navigate(`/wizard/${id1}/step/basics?returnTo=${mergeReturnTo}`)
        }
      >
        Edit {profileA.basics?.name ?? "Cat A"}
      </Button>
      <Button
        onClick={() =>
          navigate(`/wizard/${id2}/step/basics?returnTo=${mergeReturnTo}`)
        }
      >
        Edit {profileB.basics?.name ?? "Cat B"}
      </Button>
      <PDFViewer style={{ width: "100%", height: "80vh" }}>
        <MergedPDF profileA={profileA} profileB={profileB} />
      </PDFViewer>
    </main>
  );
}
