import { Center, Flex, LoadingOverlay } from "@mantine/core";
import React from "react";

type Props = {
  isLoading: boolean;
  isEmpty: boolean;
  children: React.ReactNode;
};

export const ListWrapper: React.FC<Props> = ({ children, isEmpty, isLoading }) => {
  return (
    <Flex direction="column" mih={isLoading || isEmpty ? 200 : 0} pos="relative">
      {isLoading ? (
        <LoadingOverlay visible={isLoading} />
      ) : isEmpty ? (
        <Center sx={{ flex: 1 }} fw="bold" fz="1.3rem">
          Trống
        </Center>
      ) : (
        children
      )}
    </Flex>
  );
};
