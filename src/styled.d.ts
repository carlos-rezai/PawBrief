import "styled-components";
import { theme } from "./tokens";

type Theme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
