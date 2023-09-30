import { ActionIcon, LoadingOverlay } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { api } from "../../../utils/api";
import { notiAction } from "../../../utils/notificator";

type Props = {
  freelancerId: string;
  contestId: string;
  gallery: string;
  url: string;
};

export const ApproveButton: React.FC<Props> = ({ freelancerId, contestId, gallery, url }) => {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const { mutateAsync: createOrder } = api.orderContest.create.useMutation();

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      await createOrder({ freelancerId, contestId, gallery, url });

      await router.push("/orders");

      notiAction({});
    } catch (error) {
      console.log(error);

      notiAction({ isFailed: true });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isApproving} />

      <ActionIcon variant="light" color="green" loading={isApproving} onClick={() => void handleApprove()}>
        <IconCheck size="1rem" />
      </ActionIcon>
    </>
  );
};
