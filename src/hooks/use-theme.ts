import { type ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { keys } from "../constants";

export const useTheme = () => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  return theme;
};
