import { type ColorScheme, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

import { keys, mantineTheme } from "../constants";
import { Layout } from "../layouts";
import { api } from "../utils/api";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [theme] = useLocalStorage<ColorScheme>({
    key: keys.COLOR_SCHEME,
    defaultValue: "light",
  });

  useEffect(() => {
    const localStorageTheme = localStorage.getItem(keys.COLOR_SCHEME);

    if (!localStorageTheme) {
      localStorage.setItem(keys.COLOR_SCHEME, "light");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Glancer</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme(theme)}>
        <NotificationsProvider>
          <SessionProvider session={session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
