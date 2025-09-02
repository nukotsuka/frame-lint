import { PluginToUiMessage } from "@frame-lint/message-types";

export const postMessage = (message: PluginToUiMessage) => {
  figma.ui.postMessage(message);
};
