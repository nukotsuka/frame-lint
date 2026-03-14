import { postMessage } from "./post-message";

export const frameSelected = (): void => {
  const selection = figma.currentPage.selection;
  if (
    selection.length === 1 &&
    (selection[0].type === "FRAME" || selection[0].type === "COMPONENT" || selection[0].type === "COMPONENT_SET" || selection[0].type === "INSTANCE")
  ) {
    postMessage({
      type: "frame-selected",
      frameId: selection[0].id,
      frameName: selection[0].name,
    });
  } else {
    postMessage({
      type: "frame-selected",
      frameId: null,
      frameName: null,
    });
  }
};
