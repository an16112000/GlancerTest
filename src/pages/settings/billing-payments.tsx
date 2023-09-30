import { Title } from "@mantine/core";
import { type NextPage } from "next";

import { Section } from "../../components";
import { BillingPayments } from "../../features/settings";
import { useProtectedPage } from "../../hooks";

const BillingPaymentsPage: NextPage = () => {
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Title order={2}>Cài đặt</Title>

      <BillingPayments />
    </Section>
  );
};

export default BillingPaymentsPage;
