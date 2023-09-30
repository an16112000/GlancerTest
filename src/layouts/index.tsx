import { Box, type BoxProps, LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

export const Layout: React.FC<BoxProps> = ({ children }) => {
  const { status } = useSession();

  const loadingSession = useMemo(() => status === "loading", [status]);

  return (
    <Box>
      <LoadingOverlay visible={loadingSession} overlayBlur={2} />

      <Header />

      <Box mih="87.7vh">{children}</Box>

      <Footer />
    </Box>
  );
};
