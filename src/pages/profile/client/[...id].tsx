import { Box, type ColorScheme, LoadingOverlay, Paper, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { type NextPage } from "next";
import { useRouter } from "next/router";

import { Section } from "../../../components";
import { keys } from "../../../constants";
import { UserInfoSection, UserReviewSection } from "../../../features/profile";
import { api } from "../../../utils/api";

const ProfileClient: NextPage = () => {
  const {
    query: { id },
  } = useRouter();
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const { data, isLoading } = api.user.getById.useQuery(
    { id: Array.isArray(id) ? id[0] || "" : id || "" },
    { enabled: !!id },
  );

  return (
    <Section size={800}>
      <Title order={2} mb="xl">
        Hồ sơ khách hàng
      </Title>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} />

        {data && (
          <Paper withBorder={theme === "dark"} shadow={theme === "dark" ? undefined : "md"} p="xl">
            <UserInfoSection user={data} />

            <UserReviewSection user={data} />
          </Paper>
        )}
      </Box>
    </Section>
  );
};

export default ProfileClient;
