import { FrameInfo } from "@frame-lint/message-types";

import { loadAllowedPatterns } from "./allowed-pattern";
import { postMessage } from "./post-message";

const instanceHasSlotProperty = (node: InstanceNode): boolean => {
  const props = node.componentProperties;
  return (Object.keys(props) as (keyof typeof props)[]).some((key) => (props[key].type as string) === "SLOT");
};

const hasSlotDescendant = (node: BaseNode): boolean => {
  if ((node.type as string) === "SLOT") return true;
  if ("children" in node) {
    for (const child of (node as { children: readonly SceneNode[] }).children) {
      if (hasSlotDescendant(child)) return true;
    }
  }
  return false;
};

// insideInstanceNotSlot: SLOT-containing INSTANCE の SLOT 以外の子孫をトラバース中かどうか。
// true の場合、FRAME/COMPONENT はフレームリストに追加しない（SLOT と無関係な部分のため）。
const getAllFrames = (
  node: BaseNode,
  includeRoot = true,
  insideInstanceNotSlot = false,
): (FrameNode | ComponentNode | ComponentSetNode | InstanceNode)[] => {
  const frames: (FrameNode | ComponentNode | ComponentSetNode | InstanceNode)[] = [];

  if (includeRoot) {
    if (
      !insideInstanceNotSlot &&
      (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "COMPONENT_SET")
    ) {
      frames.push(node as FrameNode | ComponentNode | ComponentSetNode);
    } else if (node.type === "INSTANCE" && hasSlotDescendant(node)) {
      frames.push(node as InstanceNode);
    }
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
        frames.push(...getAllFrames(child, true, insideInstanceNotSlot));
      }
    }
  } else if ((node.type as string) === "SLOT") {
    // SLOT の中はすべて通常モード（insideInstanceNotSlot=false）
    if ("children" in node) {
      for (const child of (node as { children: readonly SceneNode[] }).children) {
        frames.push(...getAllFrames(child, true, false));
      }
    }
  } else if (node.type === "INSTANCE" && hasSlotDescendant(node)) {
    if ("children" in node) {
      for (const child of node.children) {
        if ((child.type as string) === "SLOT") {
          // SLOT の子要素は通常モードで探索
          frames.push(...getAllFrames(child, true, false));
        } else {
          // SLOT 以外の子要素は FRAME/COMPONENT を追加しないモードで探索
          frames.push(...getAllFrames(child, true, true));
        }
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

const buildFrameHierarchy = (
  frames: (FrameNode | ComponentNode | ComponentSetNode | InstanceNode)[],
  patterns: string[],
): FrameInfo[] => {
  const frameInfos: FrameInfo[] = [];
  const processedIds = new Set<string>();

  const processFrame = (frame: FrameNode | ComponentNode | ComponentSetNode | InstanceNode): FrameInfo | null => {
    if (processedIds.has(frame.id)) {
      return null;
    }
    processedIds.add(frame.id);

    if (frame.type === "INSTANCE" && !instanceHasSlotProperty(frame)) {
      if (!hasSlotDescendant(frame)) {
        return {
          id: frame.id,
          name: frame.name,
          type: "INSTANCE",
          layoutMode: "NONE",
          isValid: true,
        };
      }
    }

    const isValid =
      frame.type === "INSTANCE" ||
      frame.type === "COMPONENT_SET" ||
      frame.parent?.type === "PAGE" ||
      frame.parent?.type === "SECTION" ||
      frame.parent?.type === "COMPONENT_SET" ||
      checkFrameName(frame.name, patterns);

    const childFrames: FrameInfo[] = [];
    if ("children" in frame) {
      for (const child of frame.children) {
        if ((child.type as string) === "SLOT" && "children" in child) {
          const slotChildren: FrameInfo[] = [];
          for (const slotChild of (child as { children: readonly SceneNode[] }).children) {
            if (slotChild.type === "FRAME" || slotChild.type === "COMPONENT" || slotChild.type === "INSTANCE") {
              const childInfo = processFrame(slotChild as FrameNode | ComponentNode | InstanceNode);
              if (childInfo) {
                slotChildren.push(childInfo);
              }
            }
          }
          childFrames.push({
            id: (child as { id: string }).id,
            name: child.name,
            type: "SLOT",
            layoutMode: "NONE",
            isValid: true,
            children: slotChildren.length > 0 ? slotChildren : undefined,
          });
        } else if (
          child.type === "FRAME" ||
          child.type === "COMPONENT" ||
          child.type === "COMPONENT_SET" ||
          child.type === "INSTANCE"
        ) {
          // INSTANCE の子要素は SLOT 子孫を持つものだけ処理（SLOT の兄弟であるが SLOT でない要素を除外）
          // FRAME/COMPONENT/COMPONENT_SET の子要素はすべて処理
          if (frame.type !== "INSTANCE" || hasSlotDescendant(child)) {
            const childInfo = processFrame(child as FrameNode | ComponentNode | ComponentSetNode | InstanceNode);
            if (childInfo) {
              childFrames.push(childInfo);
            }
          }
        }
      }
    }

    return {
      id: frame.id,
      name: frame.name,
      type:
        frame.type === "COMPONENT" && frame.parent?.type === "COMPONENT_SET"
          ? ("VARIANT" as const)
          : (frame.type as "FRAME" | "COMPONENT" | "COMPONENT_SET" | "INSTANCE"),
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
  let allFrames: (FrameNode | ComponentNode | ComponentSetNode | InstanceNode)[];

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
