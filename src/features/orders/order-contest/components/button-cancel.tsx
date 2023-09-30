import { Button } from "@mantine/core";
import { OrderStatus, Role } from "@prisma/client";
import React from "react";

import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

type Props = {
  id: string;
  onSuccess: () => void;
  isFreelancer: boolean;
  disabled: boolean;
};

export const ButtonCancel: React.FC<Props> = ({ id, onSuccess, isFreelancer, disabled }) => {
  const { mutateAsync: updateOrder, isLoading } = api.orderContest.update.useMutation();

  const cancelRequest = async () => {
    try {
      await updateOrder({ id, status: OrderStatus.CANCELED, canceler: isFreelancer ? Role.FREELANCER : Role.CLIENT });

      notiAction({});

      onSuccess();
    } catch (error) {
      console.log(error);

      notiAction({ isFailed: true });
    }
  };
  return (
    <Button variant="outline" color="red" onClick={() => void cancelRequest()} loading={isLoading} disabled={disabled}>
      Hủy bỏ
    </Button>
  );
};
