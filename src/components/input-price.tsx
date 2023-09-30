import { NumberInput, type NumberInputProps, Text } from "@mantine/core";
import React from "react";

export const InputPrice: React.FC<NumberInputProps> = ({ ...props }) => {
  return (
    <NumberInput
      {...props}
      parser={(value) => value?.replace(/\₫\s?|(,*)/g, "")}
      formatter={(value) =>
        !Number.isNaN(parseFloat(value || "")) ? `${value || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
      }
      rightSection={
        <Text fz="xs" fw="bold">
          VND
        </Text>
      }
      rightSectionWidth={40}
    />
  );
};
