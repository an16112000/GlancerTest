import { ActionIcon } from "@mantine/core";
import { IconHeartMinus, IconHeartPlus } from "@tabler/icons";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

type Props = {
  jobId: string;
  onSaveSuccess?: () => Promise<void>;
  onUnsaveSuccess?: (jobId: string) => void;
};

export const ButtonSave: React.FC<Props> = ({ jobId, onUnsaveSuccess, onSaveSuccess }) => {
  const { data: session } = useSession();
  const {
    data: savedJob,
    isLoading: isLoadingList,
    refetch,
  } = api.saveJob.getById.useQuery(
    { freelancerId: session?.user?.id || "", jobId },
    { enabled: !!session?.user?.id, refetchOnWindowFocus: false },
  );
  const { mutateAsync: saveJob } = api.saveJob.save.useMutation();
  const { mutateAsync: unsaveJob } = api.saveJob.unsave.useMutation();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = useMemo(() => !!savedJob, [savedJob]);

  const handleClick = async () => {
    try {
      setIsSaving(true);

      if (isSaved) await handleUnsave();
      else await handleSave();

      await refetch();

      notiAction({});
    } catch (error) {
      console.log(error);

      notiAction({ isFailed: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (session && session.user) {
      await saveJob({ freelancerId: session.user.id, jobId });

      onSaveSuccess && (await onSaveSuccess());
    }
  };

  const handleUnsave = async () => {
    if (session && session.user) {
      await unsaveJob({ freelancerId: session.user.id, jobId });

      onUnsaveSuccess && onUnsaveSuccess(jobId);
    }
  };

  return (
    <ActionIcon
      variant="light"
      size="lg"
      color={isSaved ? "red" : "green"}
      radius="xl"
      onClick={() => void handleClick()}
      disabled={isLoadingList}
      loading={isSaving}
    >
      {isSaved ? <IconHeartMinus size="1.1rem" /> : <IconHeartPlus size="1.1rem" />}
    </ActionIcon>
  );
};
