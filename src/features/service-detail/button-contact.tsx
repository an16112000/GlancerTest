import { Button, type ButtonProps } from "@mantine/core";
import React from "react";

import { useContact } from "../../hooks";

type Props = ButtonProps & {
  otherPersonId: string;
};

export const ButtonContact: React.FC<Props> = ({ otherPersonId, ...props }) => {
  const { handleClick, isLoading } = useContact();

  return (
    <Button fullWidth variant="light" loading={isLoading} onClick={() => void handleClick(otherPersonId)} {...props}>
      Liên hệ
    </Button>
  );
};
