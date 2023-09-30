import { Container, type ContainerProps } from "@mantine/core";
import React from "react";

export const Section: React.FC<ContainerProps> = ({ ...props }) => {
  return <Container size={1440} px="md" py="xl" {...props} />;
};
