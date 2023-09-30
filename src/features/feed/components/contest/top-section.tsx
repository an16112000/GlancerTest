import { Badge, Group } from "@mantine/core";
import { useSession } from "next-auth/react";
import React, { useMemo } from "react";

import { ButtonSave } from "./button-save";

type Props = {
  categoryName: string;
  contestId: string;
  ownerId: string;
  onSaveSuccess?: () => Promise<void>;
  onUnsaveSuccess?: (contestId: string) => void;
};

export const TopSection: React.FC<Props> = ({ categoryName, contestId, ownerId, onUnsaveSuccess, onSaveSuccess }) => {
  const { data: session } = useSession();

  const isOwner = useMemo(() => {
    return session?.user?.id === ownerId;
  }, [ownerId, session?.user?.id]);

  return (
    <Group position="apart" mb="xs">
      <Badge>{categoryName}</Badge>

      {!isOwner && <ButtonSave contestId={contestId} onUnsaveSuccess={onUnsaveSuccess} onSaveSuccess={onSaveSuccess} />}
    </Group>
  );
};
