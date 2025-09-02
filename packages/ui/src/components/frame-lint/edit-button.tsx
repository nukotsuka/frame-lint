import { Menu, IconButton, Portal } from "@chakra-ui/react";
import { FrameInfo } from "@frame-lint/message-types";
import React, { useCallback } from "react";
import { LuPencil } from "react-icons/lu";

import { postMessage } from "../../utils/post-message";
import { Tooltip } from "../ui";

type EditButtonProps = {
  frameId: string;
  allowedPatterns: string[];
  setFrameInfos: React.Dispatch<React.SetStateAction<FrameInfo[] | null>>;
};

export const EditButton = ({
  frameId,
  allowedPatterns,
  setFrameInfos,
}: EditButtonProps) => {
  const handleUpdateFrameName = useCallback(
    (name: string) => {
      const updateFrameRecursive = (frames: FrameInfo[]): FrameInfo[] => {
        return frames.map((frame) => {
          if (frame.id === frameId) {
            return { ...frame, name, isValid: true };
          }
          if (frame.children) {
            return { ...frame, children: updateFrameRecursive(frame.children) };
          }
          return frame;
        });
      };
      setFrameInfos((prev) => {
        if (!prev) return null;
        return updateFrameRecursive(prev);
      });

      postMessage({ type: "update-frame-name", frameId, name });
    },
    [frameId, setFrameInfos]
  );

  const handleUngroupFrame = useCallback(() => {
    const ungroupFrameRecursive = (frames: FrameInfo[]): FrameInfo[] => {
      const result: FrameInfo[] = [];

      for (const frame of frames) {
        if (frame.id === frameId) {
          if (frame.children && frame.children.length > 0) {
            result.push(...frame.children);
          }
        } else if (frame.children) {
          result.push({
            ...frame,
            children: ungroupFrameRecursive(frame.children),
          });
        } else {
          result.push(frame);
        }
      }

      return result;
    };

    setFrameInfos((prev) => {
      if (!prev) return null;
      return ungroupFrameRecursive(prev);
    });

    postMessage({ type: "ungroup-frame", frameId });
  }, [frameId, setFrameInfos]);

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Tooltip content="Edit">
          <IconButton size="sm" variant="ghost">
            <LuPencil />
          </IconButton>
        </Tooltip>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Update Name to...</Menu.ItemGroupLabel>
              {allowedPatterns.map((pattern) => (
                <Menu.Item
                  key={pattern}
                  onClick={() => handleUpdateFrameName(pattern)}
                  value={pattern}
                >
                  {pattern}
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.Item
              color="fg.error"
              _hover={{
                bg: "bg.error",
                color: "fg.error",
              }}
              onClick={handleUngroupFrame}
              value="Ungroup"
            >
              Ungroup
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
