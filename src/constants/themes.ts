import { type ColorScheme, type MantineThemeOverride } from "@mantine/core";
import "dayjs/locale/vi";

export const mantineTheme: (theme: ColorScheme) => MantineThemeOverride = (theme) => ({
  colorScheme: theme,
  dateFormat: "DD/MM/YYYY",
  datesLocale: "vi",
  primaryColor: "violet",
  focusRing: "never",
  globalStyles(theme) {
    const fontStyle = theme.fn.fontStyles() as object;

    return {
      "*, *::before, *::after": {
        boxSizing: "border-box",
      },

      body: {
        ...fontStyle,
        backgroundColor: theme.colorScheme === "light" ? "#f7f7f7" : "",
      },

      a: {
        color: theme.colorScheme === "dark" ? "white" : "#333",
        textDecoration: "none",
      },
    };
  },
});
