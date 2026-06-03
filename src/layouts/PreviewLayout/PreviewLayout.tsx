import type { ReactNode } from "react";
import Header from "../../components/Header/Header";
import {
  PreviewActions,
  PreviewContent,
  PreviewHeader,
  PreviewTitle,
} from "./PreviewLayout.styles";

interface PreviewLayoutProps {
  title: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}

export default function PreviewLayout({
  title,
  actions,
  children,
}: PreviewLayoutProps) {
  return (
    <>
      <Header />
      <PreviewContent>
        <PreviewHeader>
          <PreviewTitle>{title}</PreviewTitle>
          <PreviewActions>{actions}</PreviewActions>
        </PreviewHeader>
        {children}
      </PreviewContent>
    </>
  );
}
