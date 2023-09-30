import { Button } from "@mantine/core";
import { TransactionOrderType } from "@prisma/client";
import React from "react";

import { useCheckout } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

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
  const { mutateAsync: updateOrder, isLoading } = api.orderContest.update.useMutation();
  const { isLoading: isCheckoutLoading, onCheckout } = useCheckout();

  const completeRequest = async () => {
    try {
      if (isFreelancer) {
        await updateOrder({ id, freelancerDone: true });

        notiAction({});

        onSuccess();
      } else {
        await onCheckout(productName, price, id, TransactionOrderType.CONTEST, partnerId);
      }
    } catch (error) {
      console.log(error);

      notiAction({ isFailed: true });
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
