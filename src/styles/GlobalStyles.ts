import { createGlobalStyle } from "styled-components";
import font400 from "../assets/fonts/PlusJakartaSans-Regular.ttf";
import font500 from "../assets/fonts/PlusJakartaSans-Medium.ttf";
import font600 from "../assets/fonts/PlusJakartaSans-SemiBold.ttf";
import font700 from "../assets/fonts/PlusJakartaSans-Bold.ttf";
import font800 from "../assets/fonts/PlusJakartaSans-ExtraBold.ttf";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: url(${font400}) format('truetype');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    src: url(${font500}) format('truetype');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-style: normal;
    font-display: swap;
    src: url(${font600}) format('truetype');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    src: url(${font700}) format('truetype');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 800;
    font-style: normal;
    font-display: swap;
    src: url(${font800}) format('truetype');
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.typography.family};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.ink};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
