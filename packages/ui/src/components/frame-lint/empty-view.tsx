import { EmptyState, VStack } from "@chakra-ui/react";
import { LuSquareDashed, LuCircleCheck } from "react-icons/lu";

type EmptyViewProps = {
  hasResults: boolean;
};

export const EmptyView = ({ hasResults }: EmptyViewProps) => {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>{hasResults ? <LuCircleCheck /> : <LuSquareDashed />}</EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{hasResults ? "No invalid frames found" : "No results yet"}</EmptyState.Title>
          <EmptyState.Description>
            {hasResults ? "All frame names are valid" : "Please run the lint to see the results"}
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
};
