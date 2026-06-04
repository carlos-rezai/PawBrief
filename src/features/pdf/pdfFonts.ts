import { Font } from "@react-pdf/renderer";
import font400 from "../../assets/fonts/PlusJakartaSans-Regular.ttf";
import font500 from "../../assets/fonts/PlusJakartaSans-Medium.ttf";
import font600 from "../../assets/fonts/PlusJakartaSans-SemiBold.ttf";
import font700 from "../../assets/fonts/PlusJakartaSans-Bold.ttf";
import font800 from "../../assets/fonts/PlusJakartaSans-ExtraBold.ttf";

Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: font400, fontWeight: 400 },
    { src: font500, fontWeight: 500 },
    { src: font600, fontWeight: 600 },
    { src: font700, fontWeight: 700 },
    { src: font800, fontWeight: 800 },
  ],
});
