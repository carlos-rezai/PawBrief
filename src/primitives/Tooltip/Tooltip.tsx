import { cloneElement, useId, useState } from "react";
import { TooltipBubble, TooltipRoot } from "./Tooltip.styles";

interface TooltipProps {
  content: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  side?: "top" | "bottom";
}

export default function Tooltip({
  content,
  children,
  side = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <TooltipRoot
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {cloneElement(children, { "aria-describedby": id })}
      <TooltipBubble
        id={id}
        role="tooltip"
        $visible={visible}
        $side={side}
        aria-hidden={!visible}
      >
        {content}
      </TooltipBubble>
    </TooltipRoot>
  );
}
