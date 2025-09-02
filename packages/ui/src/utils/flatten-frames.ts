import { FrameInfo } from "@frame-lint/message-types";

export const flattenFrames = (frames: FrameInfo[], level = 0): (FrameInfo & { level: number })[] => {
  const result: (FrameInfo & { level: number })[] = [];

  for (const frame of frames) {
    result.push({ ...frame, level });
    if (frame.children) {
      result.push(...flattenFrames(frame.children, level + 1));
    }
  }

  return result;
};
