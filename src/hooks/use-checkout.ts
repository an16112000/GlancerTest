import type { TransactionOrderType } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import React from "react";

import { getStripe } from "../libs/stripe-client";
import { api } from "../utils/api";

export const useCheckout = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutateAsync: apiCheckout } = api.stripe.checkoutSession.useMutation();
  const { mutateAsync: apiCreateTransaction } = api.transaction.create.useMutation();

  const onCheckout = async (
    productName: string,
    amount: number,
    orderId: string,
    type: TransactionOrderType,
    receiverId: string,
  ) => {
    if (session && session.user) {
      try {
        setIsLoading(true);

        const transactionId = nanoid(25);

        await apiCreateTransaction({
          id: transactionId,
          amount,
          orderId,
          type,
          receiverId,
          senderId: session.user.id,
        });

        const { id: sessionId } = await apiCheckout({
          productName,
          amount,
          transactionId,
        });

        const stripe = await getStripe();

        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });

          alert(error);
        }
      } catch (error) {
        if (error instanceof TRPCClientError) {
          alert(error.message);
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    onCheckout,
    isLoading,
  };
};
