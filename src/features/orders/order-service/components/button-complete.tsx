import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { TransactionOrderType } from "@prisma/client";
import React from "react";

import { useCheckout } from "../../../../hooks";
import { api } from "../../../../utils/api";

type Props = {
  id: string;
  onSuccess: () => void;
  isFreelancer: boolean;
  disabled: boolean;
  productName: string;
  price: number;
  partnerId: string;
};

export const ButtonComplete: React.FC<Props> = ({
  id,
  onSuccess,
  isFreelancer,
  disabled,
  price,
  productName,
  partnerId,
}) => {
  const { mutateAsync: updateOrder, isLoading } = api.orderService.update.useMutation();
  const { isLoading: isCheckoutLoading, onCheckout } = useCheckout();

  const completeRequest = async () => {
    try {
      if (isFreelancer) {
        await updateOrder({ id, freelancerDone: true });

        showNotification({
          color: "green",
          message: "Thao tác thành công!",
        });

        onSuccess();
      } else {
        await onCheckout(productName, price, id, TransactionOrderType.SERVICE, partnerId);
      }
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Thao tác thất bại!",
      });
    }
  };
  return (
    <Button
      variant="outline"
      color="teal"
      onClick={() => void completeRequest()}
      loading={isLoading || isCheckoutLoading}
      disabled={disabled}
    >
      {isFreelancer ? "Hoàn thành" : "Thanh toán"}
    </Button>
  );
};
