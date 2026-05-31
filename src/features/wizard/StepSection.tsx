import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

const SectionWrapper = styled.div<{ $first?: boolean }>`
  margin-top: ${({ $first }) => ($first ? 0 : 26)}px;
`;

const SectionTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: -0.2px;
  margin: 0 0 8px;
`;

const SectionHint = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 2px 0 8px;
`;

SectionTitle.defaultProps = { theme: defaultTheme };
SectionHint.defaultProps = { theme: defaultTheme };

interface StepSectionProps {
  title?: string;
  hint?: string;
  first?: boolean;
  children: React.ReactNode;
}

export default function StepSection({
  title,
  hint,
  first,
  children,
}: StepSectionProps) {
  return (
    <SectionWrapper $first={first}>
      {title && <SectionTitle>{title}</SectionTitle>}
      {hint && <SectionHint>{hint}</SectionHint>}
      {children}
    </SectionWrapper>
  );
}
