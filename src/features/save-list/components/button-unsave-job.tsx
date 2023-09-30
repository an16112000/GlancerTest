import { ActionIcon } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconHeartMinus } from "@tabler/icons";
import React, { useState } from "react";

import { api } from "../../../utils/api";
import { notiAction } from "../../../utils/notificator";

type Props = {
  freelancerId: string;
  jobId: string;
  onSuccess: () => void;
};

export const ButtonUnsaveJob: React.FC<Props> = ({ onSuccess, freelancerId, jobId }) => {
  const { mutateAsync: removeSave } = api.saveJob.unsave.useMutation();
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleRemove = async () => {
    try {
      setLoadingRemove(true);

      await removeSave({ freelancerId, jobId });

      onSuccess();

      showNotification({
        color: "green",
        message: "Công việc đã được gỡ khỏi danh sách đã lưu của bạn!",
      });
    } catch (error) {
      console.log(error);

      notiAction({ isFailed: true });
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <ActionIcon color="red" variant="filled" onClick={() => void handleRemove()} loading={loadingRemove}>
      <IconHeartMinus size="1rem" />
    </ActionIcon>
  );
};
