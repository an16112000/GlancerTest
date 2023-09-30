import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { OrderStatus } from "@prisma/client";
import React from "react";

import { api } from "../../../../utils/api";

type Props = {
  id: string;
  onSuccess: () => void;
};

export const ButtonReject: React.FC<Props> = ({ id, onSuccess }) => {
  const { mutateAsync: updateOrder, isLoading } = api.orderService.update.useMutation();

  const rejectRequest = async () => {
    try {
      await updateOrder({ id, status: OrderStatus.REJECTED });

      showNotification({
        color: "green",
        message: "Thao tác thành công!",
      });

      onSuccess();
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Thao tác thất bại!",
      });
    }
  };
  return (
    <Button variant="outline" color="red" onClick={() => void rejectRequest()} loading={isLoading}>
      Từ chối
    </Button>
  );
};
