import { Button, Center, Text, Title } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { Section } from "../components";
import { useProtectedPage } from "../hooks";

const Checkout: NextPage = () => {
  const { query } = useRouter();
  const transactionId = query.id as string;
  const { isAuthenticating } = useProtectedPage();

  if (isAuthenticating) return <></>;

  return (
    <Section>
      <Center mt="xl">
        <IconCircleCheck color="green" size="5rem" />
      </Center>

      <Title ta="center" my="xl">
        Thanh toán thành công
      </Title>

      <Text ta="center" mb="xl">
        Mã giao dịch: {transactionId}
      </Text>

      <Center>
        <Link href="/transactions">
          <Button variant="gradient">Xem lịch sử giao dịch</Button>
        </Link>
      </Center>
    </Section>
  );
};

export default Checkout;
