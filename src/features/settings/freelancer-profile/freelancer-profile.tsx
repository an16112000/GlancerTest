import { Box, Button, Center, Flex, Group, LoadingOverlay, Tabs, type TabsValue, Text, Title } from "@mantine/core";
import { IconEye } from "@tabler/icons";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useRefPortal } from "../../../hooks";
import { api } from "../../../utils/api";
import { Layout, TabSettings } from "../layout";
import { EducationSection, EmploymentSection, InfoSection, NewProfile, PortfolioSection } from "./components";

export const FreelancerProfile = () => {
  const { data: session } = useSession();
  const newProfileRef = useRefPortal<typeof NewProfile>();
  const {
    data: profiles,
    isLoading,
    refetch,
  } = api.freelancerProfile.getListInfoByFreelancer.useQuery(
    {
      freelancerId: session?.user?.id || "",
    },
    { enabled: !!session?.user?.id, refetchOnWindowFocus: false },
  );
  const [activeTab, setActiveTab] = useState<TabsValue>();

  useEffect(() => {
    if (profiles && profiles.length) {
      setActiveTab(profiles[0]?.id);
    }
  }, [profiles]);

  const isProfilesEmpty = useMemo(() => !profiles || profiles.length === 0, [profiles]);

  const handleAddNewProfile = () => newProfileRef.current?.openDrawer();

  const handleReload = useCallback(
    async () => {
      await refetch();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Layout activeKey={TabSettings.FREELANCER_PROFILE}>
      <Group position="apart" mb="xl">
        <Title order={3}>Hồ sơ freelancer</Title>

        {!isProfilesEmpty && (
          <Group>
            <Button onClick={handleAddNewProfile}>Thêm hồ sơ</Button>

            <Link href={`/profile/freelancer/${session?.user?.id || ""}`} target="_blank" rel="noopener noreferrer">
              <Button variant="gradient" leftIcon={<IconEye size="1em" />}>
                Xem
              </Button>
            </Link>
          </Group>
        )}
      </Group>

      {isLoading ? (
        <Box pos="relative" mih={200}>
          <LoadingOverlay visible={isLoading} />
        </Box>
      ) : isProfilesEmpty ? (
        <Flex direction="column" justify="center" mih={200}>
          <Text ta="center" pb="lg" fw="bold">
            Bạn chưa có hồ sơ nào. Vui lòng tạo hồ sơ!
          </Text>

          <Center>
            <Button onClick={handleAddNewProfile}>Thêm mới</Button>
          </Center>
        </Flex>
      ) : (
        <Tabs
          orientation="vertical"
          value={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
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
              <InfoSection profile={profile} onReloadProfile={handleReload} mb="xl" />

              <PortfolioSection profile={profile} mb="xl" />

              <EducationSection profile={profile} mb="xl" />

              <EmploymentSection profile={profile} />
            </Tabs.Panel>
          ))}
        </Tabs>
      )}

      <NewProfile ref={newProfileRef} onSuccess={handleReload} />
    </Layout>
  );
};
