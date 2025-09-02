import { postMessage } from "./post-message";

const STORAGE_KEY = "colorMode";
const DEFAULT_COLOR_MODE = "light";

export const loadColorMode = async (
  skipPostMessage?: boolean
): Promise<"light" | "dark"> => {
  let colorMode: "light" | "dark" = DEFAULT_COLOR_MODE;
  try {
    const stored = await figma.clientStorage.getAsync(STORAGE_KEY);
    if (stored && typeof stored === "string") {
      colorMode = stored as "light" | "dark";
    } else {
      colorMode = DEFAULT_COLOR_MODE;
      await figma.clientStorage.setAsync(STORAGE_KEY, colorMode);
    }
  } catch (error) {
    console.error("Failed to load patterns from storage:", error);
    colorMode = DEFAULT_COLOR_MODE;
  }

  if (!skipPostMessage) {
    postMessage({
      type: "loaded-color-mode",
      colorMode,
    });
  }

  return colorMode;
};

export const saveColorMode = async (
  colorMode: "light" | "dark"
): Promise<void> => {
  try {
    await figma.clientStorage.setAsync(STORAGE_KEY, colorMode);
  } catch (error) {
    console.error("Failed to save color mode to storage:", error);
  }
};
