import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconArchive } from "@tabler/icons";
import React, { useState } from "react";

import { api } from "../../../utils/api";

type Props = ActionIconProps & {
  jobId: string;
  onSuccess: () => Promise<void>;
};

const NOTIFICATION_KEY = "ARCHIVE";

export const ArchiveButton: React.FC<Props> = ({ jobId, onSuccess, ...props }) => {
  const { mutateAsync: apiArchive } = api.job.archive.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async () => {
    try {
      setIsLoading(true);

      showNotification({
        id: NOTIFICATION_KEY,
        loading: true,
        color: "yellow",
        message: "Đang lưu trữ công việc...",
        autoClose: false,
        disallowClose: true,
      });

      await apiArchive({ id: jobId });

      await onSuccess();

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "green",
        message: "Lưu trữ công việc thành công!",
      });
    } catch (error) {
      console.log(error);

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "red",
        message: "Lưu trữ công việc thất bại!",
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
