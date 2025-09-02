export type FrameInfo = {
  id: string;
  name: string;
  type: "FRAME" | "COMPONENT";
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL" | "GRID";
  isValid: boolean;
  children?: FrameInfo[];
};

export type PluginToUiMessage =
  | {
      type: "loaded-color-mode";
      colorMode: "light" | "dark";
    }
  | {
      type: "frame-lint-result";
      frameInfos: FrameInfo[];
    }
  | {
      type: "loaded-patterns";
      patterns: string[];
    }
  | {
      type: "frame-selected";
      frameId: string | null;
      frameName: string | null;
    };
