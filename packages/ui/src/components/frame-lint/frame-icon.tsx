import { FrameInfo } from "@frame-lint/message-types";
import { GoColumns, GoRows } from "react-icons/go";
import { LuSquarePlus } from "react-icons/lu";
import { PiDiamondFill } from "react-icons/pi";
import { RxComponent1, RxComponentInstance, RxDashboard, RxFrame } from "react-icons/rx";
import { match } from "ts-pattern";

export const FrameIcon = ({ type, layoutMode }: { type: FrameInfo["type"]; layoutMode: FrameInfo["layoutMode"] }) => {
  return match(type)
    .with("FRAME", () =>
      match(layoutMode)
        .with("HORIZONTAL", () => <GoColumns />)
        .with("VERTICAL", () => <GoRows />)
        .with("GRID", () => <RxDashboard />)
        .with("NONE", () => <RxFrame />)
        .exhaustive(),
    )
    .with("COMPONENT", () => <RxComponent1 />)
    .with("COMPONENT_SET", () => <RxComponent1 />)
    .with("VARIANT", () => <PiDiamondFill />)
    .with("INSTANCE", () => <RxComponentInstance />)
    .with("SLOT", () => <LuSquarePlus />)
    .exhaustive();
};
