import { ActionIcon, Box, Center, Grid, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconHeartOff } from "@tabler/icons";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { ServiceCard } from "../../components";
import { api } from "../../utils/api";

export const FavoriteServices = () => {
  const { data: session } = useSession();
  const {
    data: dataSource,
    isLoading,
    refetch,
  } = api.favoriteService.getAll.useQuery({ userId: session?.user?.id || "" }, { enabled: !!session?.user?.id });
  const { mutateAsync: removeFavorite } = api.favoriteService.save.useMutation();
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleRemove = async (serviceId: string) => {
    if (session && session.user && serviceId) {
      try {
        setLoadingRemove(true);

        await removeFavorite({ clientId: session.user.id || "", serviceId });

        await refetch();

        showNotification({
          color: "green",
          message: "Dịch vụ đã được gỡ khỏi danh sách yêu thích của bạn!",
        });
      } catch (error) {
        console.log(error);

        showNotification({
          color: "red",
          message: "Thao tác thất bại!",
        });
      } finally {
        setLoadingRemove(false);
      }
    }
  };

  return (
    <Box pos="relative" mih={150}>
      <LoadingOverlay visible={isLoading} />

      {!isLoading && !dataSource?.length ? (
        <Center mih={150} fw="bold" fz="1.2rem" tt="uppercase">
          Trống
        </Center>
      ) : (
        <Grid>
          {dataSource?.map((item) => (
            <Grid.Col key={nanoid()} span={3}>
              <Box pos="relative">
                <ServiceCard {...item.service} />

                <ActionIcon
                  pos="absolute"
                  top={10}
                  right={10}
                  radius="xl"
                  variant="light"
                  loading={loadingRemove}
                  color="red"
                  onClick={() => void handleRemove(item.serviceId)}
                  size="lg"
                >
                  <IconHeartOff size="1rem" />
                </ActionIcon>
              </Box>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Box>
  );
};
