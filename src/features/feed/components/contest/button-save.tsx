import { ActionIcon } from "@mantine/core";
import { IconHeartMinus, IconHeartPlus } from "@tabler/icons";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

type Props = {
  contestId: string;
  onSaveSuccess?: () => Promise<void>;
  onUnsaveSuccess?: (contestId: string) => void;
};

export const ButtonSave: React.FC<Props> = ({ contestId, onUnsaveSuccess, onSaveSuccess }) => {
  const { data: session } = useSession();
  const {
    data: listSaveContest,
    isLoading: isLoadingList,
    refetch,
  } = api.saveContest.getById.useQuery(
    { freelancerId: session?.user?.id || "", contestId },
    { enabled: !!session?.user?.id, refetchOnWindowFocus: false },
  );
  const { mutateAsync: saveContest } = api.saveContest.save.useMutation();
  const { mutateAsync: unsaveContest } = api.saveContest.unsave.useMutation();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = useMemo(() => !!listSaveContest, [listSaveContest]);

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
      await saveContest({ freelancerId: session.user.id, contestId });

      onSaveSuccess && (await onSaveSuccess());
    }
  };

  const handleUnsave = async () => {
    if (session && session.user) {
      await unsaveContest({ freelancerId: session.user.id, contestId });

      onUnsaveSuccess && onUnsaveSuccess(contestId);
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
