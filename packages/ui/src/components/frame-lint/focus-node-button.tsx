import { IconButton } from "@chakra-ui/react";
import { useCallback } from "react";
import { LuFocus } from "react-icons/lu";

import { postMessage } from "../../utils/post-message";
import { Tooltip } from "../ui";

type FocusNodeButtonProps = {
  nodeId: string;
};

export const FocusNodeButton = ({ nodeId }: FocusNodeButtonProps) => {
  const handleFocusNode = useCallback((nodeId: string) => {
    postMessage({ type: "focus-node", nodeId });
  }, []);

  return (
    <Tooltip content="Focus">
      <IconButton
        onClick={() => handleFocusNode(nodeId)}
        size="sm"
        variant="ghost"
      >
        <LuFocus />
      </IconButton>
    </Tooltip>
  );
};
