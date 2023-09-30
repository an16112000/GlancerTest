import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconArchive } from "@tabler/icons";
import React, { useState } from "react";

import { api } from "../../../utils/api";

type Props = ActionIconProps & {
  contestId: string;
  onSuccess: () => Promise<void>;
};

const NOTIFICATION_KEY = "ARCHIVE";

export const ArchiveButton: React.FC<Props> = ({ contestId, onSuccess, ...props }) => {
  const { mutateAsync: apiArchive } = api.contest.archive.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async () => {
    try {
      setIsLoading(true);

      showNotification({
        id: NOTIFICATION_KEY,
        loading: true,
        color: "yellow",
        message: "Đang lưu trữ cuộc thi...",
        autoClose: false,
        disallowClose: true,
      });

      await apiArchive({ id: contestId });

      await onSuccess();

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "green",
        message: "Lưu trữ cuộc thi thành công!",
      });
    } catch (error) {
      console.log(error);

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "red",
        message: "Lưu trữ cuộc thi thất bại!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip label="Lưu trữ">
      <ActionIcon color="orange" variant="filled" onClick={() => void handleArchive()} loading={isLoading} {...props}>
        <IconArchive size={16} />
      </ActionIcon>
    </Tooltip>
  );
};
