import { UiToPluginMessage } from "@frame-lint/message-types";
import { match } from "ts-pattern";

import { loadAllowedPatterns, saveAllowedPatterns } from "./utils/allowed-pattern";
import { loadColorMode, saveColorMode } from "./utils/color-mode";
import { frameSelected } from "./utils/frame-selected";
import { lintFrames } from "./utils/lint-frames";

figma.showUI(__html__, { width: 600, height: 800 });

figma.on("selectionchange", () => {
  frameSelected();
});

figma.ui.onmessage = async (message: UiToPluginMessage) => {
  await match(message)
    .with({ type: "load-all" }, async () => {
      frameSelected();
      await Promise.all([loadColorMode(), loadAllowedPatterns()]);
    })
    .with({ type: "save-color-mode" }, async (message) => {
      await saveColorMode(message.colorMode);
    })
    .with({ type: "lint-frames" }, async (message) => {
      await lintFrames(message.selectedFrameId);
    })
    .with({ type: "update-allowed-patterns" }, async (message) => {
      await saveAllowedPatterns(message.patterns);
    })
    .with({ type: "focus-node" }, async (message) => {
      const node = await figma.getNodeByIdAsync(message.nodeId);
      if (node && node.type === "FRAME") {
        figma.currentPage.selection = [node];
        figma.viewport.scrollAndZoomIntoView([node]);
      }
    })
    .with({ type: "update-frame-name" }, async (message) => {
      const node = await figma.getNodeByIdAsync(message.frameId);
      if (node && node.type === "FRAME") {
        node.name = message.name;
        figma.notify(`Frame name updated to ${message.name}`);
      }
    })
    .with({ type: "ungroup-frame" }, async (message) => {
      const node = await figma.getNodeByIdAsync(message.frameId);
      if (node && node.type === "FRAME") {
        figma.ungroup(node);
        figma.notify(`Frame ungrouped`);
      }
    })
    .exhaustive();
};
