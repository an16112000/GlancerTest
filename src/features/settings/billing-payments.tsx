import { Button, Flex, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useSession } from "next-auth/react";

import { keys } from "../../constants";
import { api } from "../../utils/api";
import { Layout, TabSettings } from "./layout";

export const BillingPayments = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.user.getById.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session && !!session.user },
  );
  const clipboardEmail = useClipboard({ timeout: 500 });
  const clipboardName = useClipboard({ timeout: 500 });
  const clipboardNumber = useClipboard({ timeout: 500 });
  const clipboardEndDate = useClipboard({ timeout: 500 });
  const clipboardCvv = useClipboard({ timeout: 500 });

  return (
    <Layout activeKey={TabSettings.BILLING_PAYMENTS}>
      <LoadingOverlay visible={isLoading} />

      <Title order={3} mb="xl">
        Phương thức thanh toán
      </Title>

      <Flex direction="column" gap="xs" maw={500}>
        <Group align="end">
          <TextInput label="Email" readOnly value={data?.email || ""} sx={{ flex: 1 }} />

          <Button color={clipboardEmail.copied ? "teal" : ""} onClick={() => clipboardEmail.copy(data?.email)}>
            {clipboardEmail.copied ? "Copied" : "Copy"}
          </Button>
        </Group>

        <Group align="end">
          <TextInput label="Tên trên thẻ" readOnly value={data?.name?.toUpperCase() || ""} sx={{ flex: 1 }} />

          <Button
            color={clipboardName.copied ? "teal" : ""}
            onClick={() => clipboardName.copy(data?.name?.toUpperCase())}
          >
            {clipboardName.copied ? "Copied" : "Copy"}
          </Button>
        </Group>

        <Group align="end">
          <TextInput label="Số thẻ" readOnly value={keys.TEST_CARD} sx={{ flex: 1 }} />

          <Button color={clipboardNumber.copied ? "teal" : ""} onClick={() => clipboardNumber.copy(keys.TEST_CARD)}>
            {clipboardNumber.copied ? "Copied" : "Copy"}
          </Button>
        </Group>

        <Group align="end">
          <TextInput label="Ngày hết hạn" readOnly value="12/30" sx={{ flex: 1 }} />

          <Button color={clipboardEndDate.copied ? "teal" : ""} onClick={() => clipboardEndDate.copy("12/30")}>
            {clipboardEndDate.copied ? "Copied" : "Copy"}
          </Button>
        </Group>

        <Group align="end">
          <TextInput label="CVV" readOnly value="999" sx={{ flex: 1 }} />

          <Button color={clipboardCvv.copied ? "teal" : ""} onClick={() => clipboardCvv.copy("999")}>
            {clipboardCvv.copied ? "Copied" : "Copy"}
          </Button>
        </Group>
      </Flex>
    </Layout>
  );
};
