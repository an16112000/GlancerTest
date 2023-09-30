import { Box, type ColorScheme, LoadingOverlay, Paper, Tabs, type TabsValue, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconFile, IconMessage } from "@tabler/icons";
import { nanoid } from "nanoid";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Section } from "../../../components";
import { keys } from "../../../constants";
import { UserInfoSection, UserReviewSection } from "../../../features/profile";
import {
  FreelancerEducationSection,
  FreelancerEmploymentSection,
  FreelancerPortfolioSection,
} from "../../../features/profile";
import { api } from "../../../utils/api";

const ProfileFreelancer: NextPage = () => {
  const {
    query: { id },
  } = useRouter();
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const { data: userInfo, isLoading: isLoadingUserInfo } = api.user.getById.useQuery(
    { id: Array.isArray(id) ? id[0] || "" : id || "" },
    { enabled: !!id },
  );
  const { data: profiles, isLoading: isLoadingProfiles } = api.freelancerProfile.getAllByFreelancer.useQuery(
    { freelancerId: Array.isArray(id) ? id[0] || "" : id || "" },
    { enabled: !!id },
  );
  const [activeProfile, setActiveProfile] = useState<TabsValue>();

  useEffect(() => {
    if (profiles && profiles.length) {
      setActiveProfile(profiles[0]?.id);
    }
  }, [profiles]);

  return (
    <Section size={1000}>
      <Title order={2} mb="xl">
        Hồ sơ freelancer
      </Title>

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoadingUserInfo || isLoadingProfiles} />

        {userInfo && profiles && (
          <Paper withBorder={theme === "dark"} shadow={theme === "dark" ? undefined : "md"} p="xl">
            <UserInfoSection user={userInfo} />

            <Tabs defaultValue="profiles">
              <Tabs.List>
                <Tabs.Tab value="profiles" icon={<IconFile size="0.8rem" />}>
                  Hồ sơ
                </Tabs.Tab>
                <Tabs.Tab value="reviews" icon={<IconMessage size="0.8rem" />}>
                  Đánh giá
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="reviews" pt="md">
                <UserReviewSection user={userInfo} />
              </Tabs.Panel>

              <Tabs.Panel value="profiles" pt="md">
                <Tabs
                  orientation="vertical"
                  value={activeProfile}
                  onTabChange={(tab) => {
                    setActiveProfile(tab);
                    scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  keepMounted={false}
                >
                  <Tabs.List mr="xl">
                    {profiles?.map((profile) => (
                      <Tabs.Tab key={nanoid()} value={profile.id}>
                        <Text
                          w={150}
                          display="inline-block"
                          sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                        >
                          {profile.title}
                        </Text>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>

                  {profiles?.map((profile) => (
                    <Tabs.Panel key={nanoid()} value={profile.id} pos="relative">
                      <Title order={2} mt="xs" mb="lg">
                        {profile.title}
                      </Title>

                      <FreelancerPortfolioSection portfolios={profile.portfolios} mb="md" />

                      <FreelancerEducationSection educations={profile.educations} mb="md" />

                      <FreelancerEmploymentSection employments={profile.employments} />
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Tabs.Panel>
            </Tabs>
          </Paper>
        )}
      </Box>
    </Section>
  );
};

export default ProfileFreelancer;
