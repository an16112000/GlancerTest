import { Title } from "@mantine/core";
import { type NextPage } from "next";

import { Section } from "../../components";
import { ClientProfile } from "../../features/settings";
import { useProtectedPage } from "../../hooks";

const ClientProfilePage: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Title order={2}>Cài đặt</Title>

      <ClientProfile />
    </Section>
  );
};

export default ClientProfilePage;
