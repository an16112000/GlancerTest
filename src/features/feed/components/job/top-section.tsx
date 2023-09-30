import { Badge, Group } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";

import { ButtonSave } from "./button-save";

type Props = {
  categoryName: string;
  jobId: string;
  ownerId: string;
  onSaveSuccess?: () => Promise<void>;
  onUnsaveSuccess?: (jobId: string) => void;
};

export const TopSection: React.FC<Props> = ({ categoryName, jobId, ownerId, onUnsaveSuccess, onSaveSuccess }) => {
  const { data: session } = useSession();

  const isOwner = useMemo(() => {
    return session?.user?.id === ownerId;
  }, [ownerId, session?.user?.id]);

  return (
    <Group position="apart" mb="xs">
      <Badge>{categoryName}</Badge>

      {!isOwner && <ButtonSave jobId={jobId} onUnsaveSuccess={onUnsaveSuccess} onSaveSuccess={onSaveSuccess} />}
    </Group>
  );
};
