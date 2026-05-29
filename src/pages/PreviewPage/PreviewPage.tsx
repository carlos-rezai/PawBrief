import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile } from "../../features/profile";
import { usePhotoBlobUrls } from "../../features/preview/usePhotoBlobUrls";
import SinglePDF from "../../features/pdf/SinglePDF";
import { Button } from "../../primitives";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading } = useProfile(id ?? "");
  const photoBlobUrls = usePhotoBlobUrls(profile);

  useEffect(() => {
    if (!loading && profile === null) {
      navigate("/", { replace: true });
    }
  }, [loading, profile, navigate]);

  if (loading) return null;
  if (!profile) return null;

  const fileName = `${profile.basics?.name ?? "cat"}-care-guide.pdf`;

  return (
    <main>
      <PDFDownloadLink
        document={<SinglePDF profile={profile} photoBlobUrls={photoBlobUrls} />}
        fileName={fileName}
      >
        {({ loading: pdfLoading }) => (
          <Button disabled={pdfLoading}>Download PDF</Button>
        )}
      </PDFDownloadLink>
      <Button
        onClick={() => navigate(`/wizard/${id}/step/basics?returnTo=preview`)}
      >
        Edit Profile
      </Button>
      <PDFViewer style={{ width: "100%", height: "80vh" }}>
        <SinglePDF profile={profile} photoBlobUrls={photoBlobUrls} />
      </PDFViewer>
    </main>
  );
}
