import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { OrderStatus, Role } from "@prisma/client";
import React from "react";

import { api } from "../../../../utils/api";

type Props = {
  id: string;
  onSuccess: () => void;
  isFreelancer: boolean;
  disabled: boolean;
};

export const ButtonCancel: React.FC<Props> = ({ id, onSuccess, isFreelancer, disabled }) => {
  const { mutateAsync: updateOrder, isLoading } = api.orderService.update.useMutation();

  const cancelRequest = async () => {
    try {
      await updateOrder({ id, status: OrderStatus.CANCELED, canceler: isFreelancer ? Role.FREELANCER : Role.CLIENT });

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
    <Button variant="outline" color="red" onClick={() => void cancelRequest()} loading={isLoading} disabled={disabled}>
      Hủy bỏ
    </Button>
  );
};
