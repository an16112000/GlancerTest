import { Title, TypographyStylesProvider } from "@mantine/core";
import React from "react";

type Props = {
  info?: string;
};

export const InfoSection: React.FC<Props> = ({ info = "" }) => {
  return (
    <>
      <Title order={3} mb="md">
        Về dịch vụ
      </Title>

      <TypographyStylesProvider>
        <div dangerouslySetInnerHTML={{ __html: info }} />
      </TypographyStylesProvider>
    </>
  );
};
