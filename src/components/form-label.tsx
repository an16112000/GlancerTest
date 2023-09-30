import React from "react";
import { type ColorScheme, Text, type TextProps } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { keys } from "../constants";

export const FormLabel: React.FC<TextProps> = ({ ...props }) => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  return (
    <Text
      fw="500"
      fz={14}
      sx={{ wordBreak: "break-word", color: theme === "dark" ? "#C1C2C5" : "#212529" }}
      mb={2}
      {...props}
    />
  );
};
