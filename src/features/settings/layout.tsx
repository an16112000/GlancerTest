import { Box, type ColorScheme, Flex } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import Link from "next/link";
import React, { useMemo } from "react";

import { keys } from "../../constants";

export enum TabSettings {
  CLIENT_PROFILE,
  FREELANCER_PROFILE,
  BILLING_PAYMENTS,
}

type Props = {
  children: React.ReactNode;
  activeKey: TabSettings;
};

export const Layout: React.FC<Props> = ({ children, activeKey }) => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });

  const unactiveBorderColor = useMemo(() => (theme === "dark" ? "#373A40" : "#dee2e6"), [theme]);

  return (
    <Flex mt="xl" gap={50}>
      <Flex direction="column" miw={250}>
        <Link href="/settings/client-profile">
          <Box
            py="xs"
            sx={{
              borderRight: `2px solid ${activeKey === TabSettings.CLIENT_PROFILE ? "#7048e8" : unactiveBorderColor}`,
            }}
          >
            Hồ sơ người dùng
          </Box>
        </Link>

        <Link href="/settings/freelancer-profile">
          <Box
            py="xs"
            sx={{
              borderRight: `2px solid ${
                activeKey === TabSettings.FREELANCER_PROFILE ? "#7048e8" : unactiveBorderColor
              }`,
            }}
          >
            Hồ sơ freelancer
          </Box>
        </Link>

        <Link href="/settings/billing-payments">
          <Box
            py="xs"
            sx={{
              borderRight: `2px solid ${activeKey === TabSettings.BILLING_PAYMENTS ? "#7048e8" : unactiveBorderColor}`,
            }}
          >
            Phương thức thanh toán
          </Box>
        </Link>
      </Flex>

      <Box sx={{ flex: 1 }} pos="relative">
        {children}
      </Box>
    </Flex>
  );
};
