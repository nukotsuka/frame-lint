"use client";

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Textarea,
  Badge,
  Separator,
  List,
} from "@chakra-ui/react";
import { FrameInfo, PluginToUiMessage } from "@frame-lint/message-types";
import equal from "fast-deep-equal";
import { useState, useEffect, useMemo, useCallback } from "react";
import { match } from "ts-pattern";

import {
  EditButton,
  EmptyView,
  FocusNodeButton,
  FrameIcon,
} from "./components/frame-lint";
import { ColorModeButton, showToast, useColorMode } from "./components/ui";
import { flattenFrames } from "./utils/flatten-frames";
import { postMessage } from "./utils/post-message";

const PATTERNS_SEPARATOR = "," as const;

function App() {
  const { colorMode, setColorMode } = useColorMode();
  const [frameInfos, setFrameInfos] = useState<FrameInfo[] | null>(null);
  const [patternInput, setPatternInput] = useState<string>("");
  const [allowedPatterns, setAllowedPatterns] = useState<string[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [selectedFrameName, setSelectedFrameName] = useState<string | null>(
    null,
  );

  const flatFrames = useMemo(
    () => frameInfos && flattenFrames(frameInfos),
    [frameInfos],
  );

  const patterns = useMemo(
    () =>
      patternInput
        .split(PATTERNS_SEPARATOR)
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
    [patternInput],
  );

  const isUpdatePatternsDisabled = useMemo(() => {
    return equal(allowedPatterns, patterns);
  }, [allowedPatterns, patterns]);

  const handleToggleColorMode = useCallback(() => {
    postMessage({
      type: "save-color-mode",
      colorMode: colorMode === "light" ? "dark" : "light",
    });
  }, [colorMode]);

  const handleUpdatePatterns = useCallback(() => {
    postMessage({ type: "update-allowed-patterns", patterns });
    setAllowedPatterns(patterns);
    showToast({
      title: "Patterns updated",
      type: "success",
    });
  }, [patterns]);

  const handleRunLint = useCallback(() => {
    postMessage({
      type: "lint-frames",
      selectedFrameId: selectedFrameId || undefined,
    });
  }, [selectedFrameId]);

  const handleMessage = useCallback(
    (event: MessageEvent<{ pluginMessage: PluginToUiMessage }>) => {
      match(event.data.pluginMessage)
        .with({ type: "frame-lint-result" }, (message) => {
          setFrameInfos(message.frameInfos);
        })
        .with({ type: "loaded-patterns" }, (message) => {
          setPatternInput(message.patterns.join(PATTERNS_SEPARATOR));
          setAllowedPatterns(message.patterns);
        })
        .with({ type: "loaded-color-mode" }, (message) => {
          setColorMode(message.colorMode);
        })
        .with({ type: "frame-selected" }, (message) => {
          setSelectedFrameId(message.frameId);
          setSelectedFrameName(message.frameName);
        })
        .exhaustive();
    },
    [setColorMode],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    postMessage({ type: "load-all" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <Box flexDirection="column" display="flex" height="100vh" padding="4">
      <VStack align="stretch" flex="1" gap="4">
        <HStack justify="space-between">
          <Heading size="lg">Frame Name Linter</Heading>
          <ColorModeButton onClick={handleToggleColorMode} />
        </HStack>

        <VStack align="stretch" gap="2">
          <HStack justify="space-between">
            <Text fontWeight="medium">Allowed Naming Patterns:</Text>
            <Button
              colorPalette="cyan"
              disabled={isUpdatePatternsDisabled}
              onClick={handleUpdatePatterns}
              size="sm"
            >
              Update Patterns
            </Button>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Enter patterns separated by "{PATTERNS_SEPARATOR}". Use * for
            wildcards.
          </Text>
          <Textarea
            onChange={(e) => setPatternInput(e.target.value)}
            placeholder="Component,Frame*,Section_*"
            rows={2}
            value={patternInput}
          />
        </VStack>

        <Separator />

        <VStack align="stretch" flex="1" gap="2" overflow="hidden">
          <HStack justify="space-between">
            <VStack align="start" gap="0">
              <Text fontWeight="medium">
                Invalid Frames ({flatFrames ? flatFrames.length : "-"})
              </Text>
              <Text color="fg.muted" fontSize="sm" lineClamp={1}>
                {selectedFrameName
                  ? `Selected: ${selectedFrameName}`
                  : "Select a frame to lint or run lint all frames"}
              </Text>
            </VStack>
            <Button colorPalette="cyan" onClick={handleRunLint} size="sm">
              {selectedFrameId ? "Lint Selected" : "Lint All"}
            </Button>
          </HStack>
          <Box
            flex="1"
            overflowY="auto"
            padding="2"
            borderWidth="1px"
            borderRadius="md"
          >
            {flatFrames === null || flatFrames.length === 0 ? (
              <EmptyView hasResults={flatFrames !== null} />
            ) : (
              <List.Root as="ul" gap="1">
                {flatFrames.map((frame) => (
                  <List.Item
                    key={frame.id}
                    as="li"
                    width="100%"
                    paddingLeft={`${frame.level * 20}px`}
                    paddingY="1"
                  >
                    <HStack justify="space-between" gap="2">
                      <HStack flex="1" gap="2">
                        <FrameIcon
                          layoutMode={frame.layoutMode}
                          type={frame.type}
                        />
                        <Text fontSize="sm" lineClamp={1}>
                          {frame.name}
                        </Text>
                        {!frame.isValid && (
                          <Badge colorPalette="red" size="sm">
                            Invalid
                          </Badge>
                        )}
                      </HStack>

                      <HStack gap="2">
                        {!frame.isValid && (
                          <EditButton
                            allowedPatterns={allowedPatterns}
                            frameId={frame.id}
                            setFrameInfos={setFrameInfos}
                          />
                        )}
                        <FocusNodeButton nodeId={frame.id} />
                      </HStack>
                    </HStack>
                  </List.Item>
                ))}
              </List.Root>
            )}
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}

export default App;
