import { Center, type ColorScheme, type CenterProps } from "@mantine/core";
import React from "react";
import { IconPhoto } from "@tabler/icons";
import { useLocalStorage } from "@mantine/hooks";
import { keys } from "../constants";

type Props = Omit<CenterProps, "children">;

export const ImagePlaceholder: React.FC<Props> = ({ ...props }) => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  return (
    <Center bg={theme === "light" ? "rgb(248, 249, 250)" : "rgb(20, 21, 23)"} {...props}>
      <IconPhoto
        size={40}
        color={theme === "light" ? "rgb(134, 142, 150)" : "rgb(144, 146, 150)"}
      />
    </Center>
  );
};
