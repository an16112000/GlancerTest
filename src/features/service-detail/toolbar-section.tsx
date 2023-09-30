import { Button, Group, Text, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import type { FavoriteService } from "@prisma/client";
import { IconHeartMinus, IconHeartPlus } from "@tabler/icons";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { api } from "../../utils/api";

type Props = {
  favorites?: FavoriteService[];
  scrollToInfo: () => void;
  scrollToFreelancer: () => void;
  scrollToReviews: () => void;
  isOwned: boolean;
  onSuccess: () => Promise<void>;
  serviceId?: string;
};

export const ToolbarSection: React.FC<Props> = ({
  favorites,
  scrollToFreelancer,
  scrollToInfo,
  scrollToReviews,
  isOwned,
  onSuccess,
  serviceId = "",
}) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: addFavorite } = api.favoriteService.save.useMutation();
  const { mutateAsync: removeFavorite } = api.favoriteService.unsave.useMutation();

  const isAddedToFavoriteList = useMemo(
    () => favorites?.some((item) => item.clientId === session?.user?.id),
    [favorites, session?.user?.id],
  );

  const handleClickFavorite = () => {
    if (isAddedToFavoriteList) void handleRemoveToFavoriteList();
    else void handleAddToFavoriteList();
  };

  const handleAddToFavoriteList = async () => {
    if (session && session.user && serviceId) {
      try {
        setLoading(true);

        await addFavorite({ clientId: session.user.id || "", serviceId });

        await onSuccess();

        showNotification({
          color: "green",
          message: "Dịch vụ đã được thêm vào danh sách yêu thích của bạn!",
        });
      } catch (error) {
        console.log(error);

        showNotification({
          color: "red",
          message: "Thao tác thất bại!",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveToFavoriteList = async () => {
    if (session && session.user && serviceId) {
      try {
        setLoading(true);

        await removeFavorite({ clientId: session.user.id || "", serviceId });

        await onSuccess();

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
        setLoading(false);
      }
    }
  };

  return (
    <Group position="apart">
      <Group>
        <Text
          variant="link"
          fw={500}
          sx={{ cursor: "pointer" }}
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          Tổng quan
        </Text>

        <Text variant="link" fw={500} sx={{ cursor: "pointer" }} onClick={() => scrollToInfo()}>
          Mô tả
        </Text>

        <Text variant="link" fw={500} sx={{ cursor: "pointer" }} onClick={() => scrollToFreelancer()}>
          Freelancer
        </Text>

        <Text variant="link" fw={500} sx={{ cursor: "pointer" }} onClick={() => scrollToReviews()}>
          Đánh giá
        </Text>
      </Group>

      <Group>
        <Tooltip label={isAddedToFavoriteList ? "Bỏ thích" : "Thích"} position="bottom">
          <Button
            leftIcon={isAddedToFavoriteList ? <IconHeartMinus /> : <IconHeartPlus />}
            variant="light"
            color={isAddedToFavoriteList ? "red" : "green"}
            disabled={isOwned || status !== "authenticated"}
            loading={loading}
            onClick={handleClickFavorite}
          >
            {favorites?.length || 0}
          </Button>
        </Tooltip>
      </Group>
    </Group>
  );
};
