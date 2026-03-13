import { FrameInfo } from "@frame-lint/message-types";

import { loadAllowedPatterns } from "./allowed-pattern";
import { postMessage } from "./post-message";

const getAllFrames = (node: BaseNode, includeRoot = true): (FrameNode | ComponentNode | InstanceNode)[] => {
  const frames: (FrameNode | ComponentNode | InstanceNode)[] = [];

  if ((node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") && includeRoot) {
    frames.push(node as FrameNode | ComponentNode | InstanceNode);
  }

  if (
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "PAGE" ||
    node.type === "SECTION" ||
    node.type === "COMPONENT_SET"
  ) {
    if ("children" in node) {
      for (const child of node.children) {
        frames.push(...getAllFrames(child));
      }
    }
  }

  return frames;
};

const checkFrameName = (name: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(name);
  });
};

const buildFrameHierarchy = (frames: (FrameNode | ComponentNode | InstanceNode)[], patterns: string[]): FrameInfo[] => {
  const frameInfos: FrameInfo[] = [];
  const processedIds = new Set<string>();

  const processFrame = (frame: FrameNode | ComponentNode | InstanceNode): FrameInfo | null => {
    if (processedIds.has(frame.id)) {
      return null;
    }
    processedIds.add(frame.id);

    if (frame.type === "INSTANCE") {
      return {
        id: frame.id,
        name: frame.name,
        type: "INSTANCE",
        layoutMode: "NONE",
        isValid: true,
      };
    }

    const isValid =
      frame.parent?.type === "PAGE" || frame.parent?.type === "SECTION" || checkFrameName(frame.name, patterns);

    const childFrames: FrameInfo[] = [];
    if ("children" in frame) {
      for (const child of frame.children) {
        if (child.type === "FRAME" || child.type === "COMPONENT" || child.type === "INSTANCE") {
          const childInfo = processFrame(child as FrameNode | ComponentNode | InstanceNode);
          if (childInfo) {
            childFrames.push(childInfo);
          }
        }
      }
    }

    return {
      id: frame.id,
      name: frame.name,
      type: frame.type as "FRAME" | "COMPONENT",
      layoutMode: "layoutMode" in frame ? frame.layoutMode : "NONE",
      isValid: isValid,
      children: childFrames.length > 0 ? childFrames : undefined,
    };
  };

  for (const frame of frames) {
    const frameInfo = processFrame(frame);
    if (frameInfo) {
      frameInfos.push(frameInfo);
    }
  }

  return frameInfos;
};

export const lintFrames = async (selectedFrameId?: string): Promise<void> => {
  let allFrames: (FrameNode | ComponentNode | InstanceNode)[];

  if (selectedFrameId) {
    const selectedNode = await figma.getNodeByIdAsync(selectedFrameId);
    if (
      selectedNode &&
      (selectedNode.type === "FRAME" ||
        selectedNode.type === "COMPONENT" ||
        selectedNode.type === "COMPONENT_SET" ||
        selectedNode.type === "INSTANCE")
    ) {
      allFrames = getAllFrames(selectedNode);
    } else {
      allFrames = getAllFrames(figma.currentPage);
    }
  } else {
    const selection = figma.currentPage.selection;
    if (
      selection.length === 1 &&
      (selection[0].type === "FRAME" ||
        selection[0].type === "COMPONENT" ||
        selection[0].type === "COMPONENT_SET" ||
        selection[0].type === "INSTANCE")
    ) {
      allFrames = getAllFrames(selection[0]);
    } else {
      allFrames = getAllFrames(figma.currentPage);
    }
  }

  const allowedPatterns = await loadAllowedPatterns(true);
  const frameInfos = buildFrameHierarchy(allFrames, allowedPatterns);

  postMessage({
    type: "frame-lint-result",
    frameInfos,
  });
};
