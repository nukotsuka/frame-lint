import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

import { Tooltip } from "./tooltip";

export type ColorModeProviderProps = {} & ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export type UseColorModeReturn = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

type ColorModeButtonProps = {} & Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton({ onClick, ...rest }, ref) {
  const { toggleColorMode } = useColorMode();
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      toggleColorMode();
      onClick?.(e);
    },
    [toggleColorMode, onClick],
  );

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <Tooltip content="Toggle color mode">
        <IconButton
          ref={ref}
          aria-label="Toggle color mode"
          onClick={handleClick}
          size="sm"
          variant="ghost"
          {...rest}
          css={{
            _icon: {
              width: "5",
              height: "5",
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </Tooltip>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        className="chakra-theme light"
        ref={ref}
        display="contents"
        color="fg"
        colorPalette="gray"
        colorScheme="light"
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        className="chakra-theme dark"
        ref={ref}
        display="contents"
        color="fg"
        colorPalette="gray"
        colorScheme="dark"
        {...props}
      />
    );
  },
);
