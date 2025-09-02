export type UiToPluginMessage =
  | { type: "load-all" }
  | {
      type: "save-color-mode";
      colorMode: "light" | "dark";
    }
  | {
      type: "focus-node";
      nodeId: string;
    }
  | { type: "lint-frames"; selectedFrameId?: string }
  | {
      type: "update-allowed-patterns";
      patterns: string[];
    }
  | {
      type: "update-frame-name";
      frameId: string;
      name: string;
    }
  | {
      type: "ungroup-frame";
      frameId: string;
    };
