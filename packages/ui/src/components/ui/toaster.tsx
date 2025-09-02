"use client";

import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from "@chakra-ui/react";

const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const showToast = (data: {
  type: Parameters<typeof toaster.create>[0]["type"];
  title: string;
  description?: string;
}) => {
  // マイクロタスクに移動して、Reactのレンダリングサイクル外で実行する
  Promise.resolve().then(() => {
    toaster.create(data);
  });
};

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster insetInline={{ mdDown: "4" }} toaster={toaster}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? <Spinner color="blue.solid" size="sm" /> : <Toast.Indicator />}
            <Stack flex="1" gap="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
