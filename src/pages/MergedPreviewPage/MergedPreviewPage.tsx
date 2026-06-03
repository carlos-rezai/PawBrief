import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile } from "../../features/profile";
import MergedPDF from "../../features/pdf/MergedPDF";
import { Button } from "../../primitives";
import Header from "../../components/Header/Header";
import {
  PreviewContent,
  PreviewHeader,
  PreviewTitle,
  PreviewActions,
  PdfViewerContainer,
} from "./MergedPreviewPage.styles";

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
  const nameA = profileA.basics?.name ?? "Cat A";
  const nameB = profileB.basics?.name ?? "Cat B";

  return (
    <>
      <Header />
      <PreviewContent>
        <PreviewHeader>
          <PreviewTitle>
            {nameA} & {nameB}'s care guide
          </PreviewTitle>
          <PreviewActions>
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
              document={<MergedPDF profileA={profileA} profileB={profileB} />}
              fileName={fileName}
            >
              {({ loading: pdfLoading }) => (
                <Button kind="primary" disabled={pdfLoading}>
                  Download PDF
                </Button>
              )}
            </PDFDownloadLink>
          </PreviewActions>
        </PreviewHeader>
        <PdfViewerContainer>
          <PDFViewer width="100%" height="100%">
            <MergedPDF profileA={profileA} profileB={profileB} />
          </PDFViewer>
        </PdfViewerContainer>
      </PreviewContent>
    </>
  );
}
