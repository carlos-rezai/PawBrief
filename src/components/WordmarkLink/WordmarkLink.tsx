import Wordmark from "../../primitives/Wordmark/Wordmark";
import { WordmarkAnchor } from "./WordmarkLink.styles";

export default function WordmarkLink() {
  return (
    <WordmarkAnchor to="/">
      <Wordmark />
    </WordmarkAnchor>
  );
}
