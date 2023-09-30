import { Box, Divider, Group, Text } from "@mantine/core";
import React from "react";

export const Footer = () => {
  return (
    <Box>
      <Divider />

      <Group position="center" p="md">
        <Text fz="0.9rem">&copy;2023 Developed by Tran Quang Nguyen</Text>
      </Group>
    </Box>
  );
};
