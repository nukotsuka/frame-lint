import { postMessage } from "./post-message";

const STORAGE_KEY = "allowedPatterns";
const DEFAULT_PATTERNS = ["Component", "Frame", "Section", "Group"];

export const loadAllowedPatterns = async (
  skipPostMessage?: boolean,
): Promise<string[]> => {
  let allowedPatterns: string[] = [];
  try {
    const stored = await figma.clientStorage.getAsync(STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      allowedPatterns = stored;
    } else {
      allowedPatterns = DEFAULT_PATTERNS;
      await figma.clientStorage.setAsync(STORAGE_KEY, allowedPatterns);
    }
  } catch (error) {
    console.error("Failed to load patterns from storage:", error);
    allowedPatterns = DEFAULT_PATTERNS;
  }

  if (!skipPostMessage) {
    postMessage({
      type: "loaded-patterns",
      patterns: allowedPatterns,
    });
  }

  return allowedPatterns;
};

export const saveAllowedPatterns = async (
  patterns: string[],
): Promise<void> => {
  try {
    await figma.clientStorage.setAsync(STORAGE_KEY, patterns);
  } catch (error) {
    console.error("Failed to save patterns to storage:", error);
  }
};
