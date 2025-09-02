import type { UiToPluginMessage } from "@frame-lint/message-types";

export const postMessage = (message: UiToPluginMessage) => {
  parent.postMessage({ pluginMessage: message }, "*");
};
