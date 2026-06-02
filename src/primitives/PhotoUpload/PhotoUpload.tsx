import { IconCamera, IconPhoto } from "../icons";
import {
  ChangeOverlay,
  Dropzone,
  DropzoneHint,
  DropzoneText,
  ErrorText,
  FieldLabel,
  HiddenInput,
  PreviewImg,
} from "./PhotoUpload.styles";

interface PhotoUploadProps {
  label?: string;
  round?: boolean;
  height?: number;
  previewUrl?: string | null;
  previewAlt?: string;
  onChange?: (file: File) => void;
  error?: string | null;
}

export default function PhotoUpload({
  label,
  round = false,
  height = 132,
  previewUrl,
  previewAlt = "Photo preview",
  onChange,
  error,
}: PhotoUploadProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChange?.(file);
    e.target.value = "";
  }

  const Icon = round ? IconCamera : IconPhoto;

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Dropzone $round={round} $height={height}>
        {previewUrl ? (
          <>
            <PreviewImg src={previewUrl} alt={previewAlt} />
            <ChangeOverlay>
              <Icon size={20} />
              Change photo
            </ChangeOverlay>
          </>
        ) : (
          <>
            <Icon size={22} />
            <DropzoneText>Add photo</DropzoneText>
            {!round && <DropzoneHint>JPG / PNG · max 5 MB</DropzoneHint>}
          </>
        )}
        <HiddenInput
          type="file"
          aria-label={label ?? "Upload photo"}
          onChange={handleChange}
        />
      </Dropzone>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </div>
  );
}
