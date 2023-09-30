import { Paper, type PaperProps } from "@mantine/core";
import React from "react";

export const Wrapper: React.FC<PaperProps> = ({ children }) => (
  <Paper withBorder p="md" radius="md" pos="relative">
    {children}
  </Paper>
);
