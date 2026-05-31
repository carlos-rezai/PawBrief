import styled from "styled-components";
import { theme as defaultTheme } from "../../tokens";

export const CardOuter = styled.div<{
  $selected: boolean;
  $mergeMode: boolean;
  $selectable: boolean;
}>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card}px;
  overflow: hidden;
  position: relative;
  border: 1.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  box-shadow: ${({ $selected, theme }) =>
    $selected
      ? `0 0 0 3px ${theme.colors.ring}, ${theme.shadows.base}`
      : theme.shadows.soft};
  transition: all 0.16s;
  cursor: ${({ $mergeMode, $selectable, $selected }) =>
    $mergeMode
      ? $selectable || $selected
        ? "pointer"
        : "not-allowed"
      : "default"};
  opacity: ${({ $mergeMode, $selectable, $selected }) =>
    $mergeMode && !$selectable && !$selected ? 0.5 : 1};

  &:hover {
    box-shadow: ${({ $selected, theme }) =>
      $selected
        ? `0 0 0 3px ${theme.colors.ring}, ${theme.shadows.base}`
        : theme.shadows.base};
    transform: ${({ $mergeMode }) =>
      $mergeMode ? "none" : "translateY(-2px)"};
  }
`;

export const PhotoZone = styled.div`
  height: 128px;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const PhotoScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.34) 0%,
    rgba(0, 0, 0, 0.1) 34%,
    rgba(0, 0, 0, 0) 56%
  );
  pointer-events: none;
`;

export const StatusBadge = styled.span<{ $complete: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 6px;
  line-height: 1;
  background: ${({ $complete, theme }) =>
    $complete ? theme.colors.primary : theme.colors.surface};
  color: ${({ $complete, theme }) =>
    $complete ? theme.colors.primaryInk : theme.colors.inkSoft};
  border: 1px solid
    ${({ $complete, theme }) =>
      $complete ? "transparent" : theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

export const MergeCheck = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "rgba(0,0,0,0.28)"};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  color: white;
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const CardName = styled.p`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
  line-height: 1.1;
`;

export const CardBreedAge = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 4px 0 0;
`;

export const CardMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 8px 0 0;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

export const ActionFlexItem = styled.div`
  flex: 1;
  display: flex;

  > button {
    width: 100%;
  }
`;

CardOuter.defaultProps = { theme: defaultTheme };
PhotoZone.defaultProps = { theme: defaultTheme };
StatusBadge.defaultProps = { theme: defaultTheme };
MergeCheck.defaultProps = { theme: defaultTheme };
CardBody.defaultProps = { theme: defaultTheme };
CardName.defaultProps = { theme: defaultTheme };
CardBreedAge.defaultProps = { theme: defaultTheme };
CardMeta.defaultProps = { theme: defaultTheme };
