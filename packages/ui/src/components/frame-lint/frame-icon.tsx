import { FrameInfo } from "@frame-lint/message-types";
import { GoColumns, GoRows } from "react-icons/go";
import { RxComponent1, RxDashboard, RxFrame } from "react-icons/rx";
import { match } from "ts-pattern";

export const FrameIcon = ({
  type,
  layoutMode,
}: {
  type: FrameInfo["type"];
  layoutMode: FrameInfo["layoutMode"];
}) => {
  return match(type)
    .with("FRAME", () =>
      match(layoutMode)
        .with("HORIZONTAL", () => <GoColumns />)
        .with("VERTICAL", () => <GoRows />)
        .with("GRID", () => <RxDashboard />)
        .with("NONE", () => <RxFrame />)
        .exhaustive()
    )
    .with("COMPONENT", () => <RxComponent1 />)
    .exhaustive();
};
