import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useProfile, getPhoto } from "../../features/profile";
import SinglePDF from "../../features/pdf/SinglePDF";
import { Button } from "../../primitives";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading } = useProfile(id ?? "");
  const [photoBlobUrls, setPhotoBlobUrls] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (!loading && profile === null) {
      navigate("/", { replace: true });
    }
  }, [loading, profile, navigate]);

  useEffect(() => {
    if (!profile) return;
    const photoIds: string[] = [];
    if (profile.basics?.photoId) photoIds.push(profile.basics.photoId);
    if (profile.feeding?.platingPhotoId)
      photoIds.push(profile.feeding.platingPhotoId);
    profile.notes?.specialNotes.forEach((n) => {
      if (n.photoId) photoIds.push(n.photoId);
    });

    if (photoIds.length === 0) return;

    Promise.all(
      photoIds.map(async (photoId) => {
        const blob = await getPhoto(photoId);
        if (!blob) return null;
        return [photoId, URL.createObjectURL(blob)] as [string, string];
      })
    ).then((entries) => {
      const urls: Record<string, string> = {};
      for (const entry of entries) {
        if (entry) urls[entry[0]] = entry[1];
      }
      setPhotoBlobUrls(urls);
    });
  }, [profile]);

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
