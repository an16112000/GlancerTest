import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconArchive } from "@tabler/icons";
import React from "react";

import { api } from "../../../utils/api";

type Props = ActionIconProps & {
  serviceId: string;
  onSuccess: () => Promise<void>;
};

const NOTIFICATION_KEY = "ARCHIVE";

export const ArchiveButton: React.FC<Props> = ({ serviceId, onSuccess, ...props }) => {
  const { mutateAsync: apiArchive } = api.service.archive.useMutation();

  const handleArchive = async () => {
    try {
      showNotification({
        id: NOTIFICATION_KEY,
        loading: true,
        color: "yellow",
        message: "Đang lưu trữ dịch vụ...",
        autoClose: false,
        disallowClose: true,
      });

      await apiArchive({ id: serviceId });

      await onSuccess();

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "green",
        message: "Lưu trữ dịch vụ thành công!",
      });
    } catch (error) {
      console.log(error);

      updateNotification({
        id: NOTIFICATION_KEY,
        color: "red",
        message: "Lưu trữ dịch vụ thất bại!",
      });
    }
  };

  return (
    <Tooltip label="Lưu trữ">
      <ActionIcon color="orange" variant="filled" onClick={() => void handleArchive()} {...props}>
        <IconArchive size={16} />
      </ActionIcon>
    </Tooltip>
  );
};
