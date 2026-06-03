import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile } from "../../features/profile";
import { usePhotoBlobUrls } from "../../features/preview/usePhotoBlobUrls";
import SinglePDF from "../../features/pdf/SinglePDF";
import { Button } from "../../primitives";
import PreviewLayout from "../../layouts/PreviewLayout/PreviewLayout";
import { PdfViewerContainer } from "../../layouts/PreviewLayout/PreviewLayout.styles";

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
  const catName = profile.basics?.name;

  return (
    <PreviewLayout
      title={catName ? `${catName}'s care guide` : "Care guide"}
      actions={
        <>
          <Button
            kind="secondary"
            onClick={() =>
              navigate(`/wizard/${id}/step/basics?returnTo=preview`)
            }
          >
            Edit Profile
          </Button>
          <PDFDownloadLink
            document={
              <SinglePDF profile={profile} photoBlobUrls={photoBlobUrls} />
            }
            fileName={fileName}
          >
            {({ loading: pdfLoading }) => (
              <Button kind="primary" disabled={pdfLoading}>
                Download PDF
              </Button>
            )}
          </PDFDownloadLink>
        </>
      }
    >
      <PdfViewerContainer>
        <PDFViewer width="100%" height="100%">
          <SinglePDF profile={profile} photoBlobUrls={photoBlobUrls} />
        </PDFViewer>
      </PdfViewerContainer>
    </PreviewLayout>
  );
}
