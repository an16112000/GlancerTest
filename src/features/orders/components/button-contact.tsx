import { Button } from "@mantine/core";
import React from "react";

import { useContact } from "../../../hooks";

export const ButtonContact = ({ otherPersonId }: { otherPersonId: string }) => {
  const { handleClick, isLoading } = useContact();

  return (
    <Button loading={isLoading} onClick={() => void handleClick(otherPersonId)}>
      Nhắn tin
    </Button>
  );
};
