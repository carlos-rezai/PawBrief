import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile } from "../../features/profile";
import { usePhotoBlobUrls } from "../../features/preview";
import { MergedPDF } from "../../features/pdf";
import { Button } from "../../primitives";
import PreviewLayout from "../../layouts/PreviewLayout/PreviewLayout";
import { PdfViewerContainer } from "../../layouts/PreviewLayout/PreviewLayout.styles";

export default function MergedPreviewPage() {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>();
  const navigate = useNavigate();
  const { profile: profileA, loading: loadingA } = useProfile(id1 ?? "");
  const { profile: profileB, loading: loadingB } = useProfile(id2 ?? "");
  const photoBlobUrlsA = usePhotoBlobUrls(profileA);
  const photoBlobUrlsB = usePhotoBlobUrls(profileB);
  const photoBlobUrls = { ...photoBlobUrlsA, ...photoBlobUrlsB };

  useEffect(() => {
    if (!loadingA && !loadingB && (profileA === null || profileB === null)) {
      navigate("/", { replace: true });
    }
  }, [loadingA, loadingB, profileA, profileB, navigate]);

  if (loadingA || loadingB) return null;
  if (!profileA || !profileB) return null;

  const fileName = `${profileA.basics?.name ?? "cat"}-${profileB.basics?.name ?? "cat"}-care-guide.pdf`;
  const mergeReturnTo = `merge/${id1}/${id2}`;
  const nameA = profileA.basics?.name ?? "Cat A";
  const nameB = profileB.basics?.name ?? "Cat B";

  return (
    <PreviewLayout
      title={`${nameA} & ${nameB}'s care guide`}
      actions={
        <>
          <Button
            kind="secondary"
            onClick={() =>
              navigate(`/wizard/${id1}/step/basics?returnTo=${mergeReturnTo}`)
            }
          >
            Edit {nameA}
          </Button>
          <Button
            kind="secondary"
            onClick={() =>
              navigate(`/wizard/${id2}/step/basics?returnTo=${mergeReturnTo}`)
            }
          >
            Edit {nameB}
          </Button>
          <PDFDownloadLink
            document={
              <MergedPDF
                profileA={profileA}
                profileB={profileB}
                photoBlobUrls={photoBlobUrls}
              />
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
          <MergedPDF
            profileA={profileA}
            profileB={profileB}
            photoBlobUrls={photoBlobUrls}
          />
        </PDFViewer>
      </PdfViewerContainer>
    </PreviewLayout>
  );
}
