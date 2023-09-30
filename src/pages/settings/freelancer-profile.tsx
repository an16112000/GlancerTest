import { Title } from "@mantine/core";
import { type NextPage } from "next";

import { Section } from "../../components";
import { FreelancerProfile } from "../../features/settings";
import { useProtectedPage } from "../../hooks";

const FreelancerProfilePage: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Title order={2}>Cài đặt</Title>

      <FreelancerProfile />
    </Section>
  );
};

export default FreelancerProfilePage;
