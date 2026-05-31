import WordmarkLink from "../WordmarkLink/WordmarkLink";
import { HeaderInner, HeaderNav } from "./Header.styles";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <HeaderNav>
      <HeaderInner>
        <WordmarkLink />
        {children}
      </HeaderInner>
    </HeaderNav>
  );
}
