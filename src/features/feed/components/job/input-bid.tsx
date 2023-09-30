import { Box, Button, Group, type GroupProps, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import { InputPrice } from "../../../../components";
import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

type Props = GroupProps & {
  onSuccess: () => Promise<void>;
  jobId: string;
};

export const InputBid: React.FC<Props> = ({ onSuccess, jobId, ...props }) => {
  const { data: session } = useSession();
  const { mutateAsync: apiBid } = api.bidJob.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [bidValue, setBidValue] = useState<number | undefined>();

  const handleBid = async () => {
    if (!bidValue) return;

    try {
      if (session && session.user) {
        setIsLoading(true);

        await apiBid({
          price: bidValue,
          freelancerId: session.user.id || "",
          jobId,
        });

        await onSuccess();

        setBidValue(undefined);

        notiAction({});
      }
    } catch (error) {
      console.log(error);
      if (error instanceof TRPCClientError && error.stack?.includes("Unique constraint failed")) {
        showNotification({
          color: "red",
          message: "Bạn chỉ được báo giá duy nhất một lần với mỗi công việc!",
        });
      } else {
        notiAction({ isFailed: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log(bidValue);

  return (
    <>
      <LoadingOverlay visible={isLoading} />

      <Group {...props}>
        <Box w="100%" sx={{ flex: 1 }}>
          <InputPrice placeholder="Điền báo giá" value={bidValue} onChange={(value) => setBidValue(value)} />
        </Box>

        <Button onClick={() => void handleBid()}>Báo giá</Button>
      </Group>
    </>
  );
};
