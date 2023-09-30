import { NumberInput, type NumberInputProps, Text } from "@mantine/core";
import React from "react";

export const InputInteger: React.FC<NumberInputProps> = ({ ...props }) => {
  return (
    <NumberInput
      {...props}
      min={1}
      precision={0}
      rightSection={
        <Text fz="xs" fw="bold">
          Ngày
        </Text>
      }
      rightSectionWidth={50}
    />
  );
};
