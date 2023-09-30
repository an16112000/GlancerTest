import { Button, Center, Grid, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconEye } from "@tabler/icons";
import { getSession, useSession } from "next-auth/react";
import { type StaticImageData } from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { keys } from "../../constants";
import { uploadFile } from "../../helpers";
import { api } from "../../utils/api";
import { formatName } from "../../utils/formatter";
import { AvatarUser } from "./components";
import { Layout, TabSettings } from "./layout";

type PropsForm = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng điền họ và tên" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  address: z.string().min(1, { message: "Vui lòng điền địa chỉ" }),
  phone: z.string().regex(keys.PHONE_REGEX, { message: "Số điện thoại không hợp lệ" }),
});

export const ClientProfile = () => {
  const refCallFirstMount = useRef(false);
  const { data: session } = useSession();
  const {
    data: userInfo,
    isLoading: isLoadingInfo,
    refetch,
  } = api.user.getById.useQuery(
    { id: session?.user?.id || "" },
    { enabled: !!session?.user?.id, refetchOnWindowFocus: false },
  );
  const { mutateAsync: updateUser } = api.user.update.useMutation();
  const [avatar, setAvatar] = useState<StaticImageData | string | undefined | null>();
  const [file, setFile] = useState<File | undefined | null>();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const form = useForm<PropsForm>({
    initialValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    validate: zodResolver(formSchema),
  });

  useEffect(() => {
    if (userInfo && !refCallFirstMount.current) {
      form.setFieldValue("name", userInfo.name || "");
      form.setFieldValue("email", userInfo.email || "");
      form.setFieldValue("address", userInfo.address || "");
      form.setFieldValue("phone", userInfo.phone || "");
      setAvatar(userInfo.image);

      refCallFirstMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleSubmit = async (values: PropsForm) => {
    try {
      if (session && session.user) {
        let image = userInfo?.image;

        setIsLoadingSubmit(true);

        if (file) {
          console.log("Uploading avatar...");

          const uploadedAvatar = await uploadFile(file);

          if (!uploadedAvatar) throw Error("Uploaded avatar is undefined");

          console.log("Uploading avatar success", uploadedAvatar);

          image = uploadedAvatar;
        }

        if (image) {
          await updateUser({ ...values, image, id: session.user.id });

          await getSession();

          await refetch();

          showNotification({
            color: "green",
            message: "Cập nhật thành công!",
          });

          setFile(undefined);
        }
      }
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Cập nhật thất bại!",
      });
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <Layout activeKey={TabSettings.CLIENT_PROFILE}>
      <LoadingOverlay visible={isLoadingInfo} />

      <Group position="apart" mb="xl">
        <Title order={3}>Hồ sơ người dùng</Title>

        <Link href={`/profile/client/${session?.user?.id || ""}`} target="_blank" rel="noopener noreferrer">
          <Button variant="gradient" leftIcon={<IconEye size="1em" />}>
            Xem
          </Button>
        </Link>
      </Group>

      <Center mb="xl">
        <AvatarUser src={avatar?.toString()} setAvatar={setAvatar} setFile={setFile}>
          {formatName(session?.user?.name)}
        </AvatarUser>
      </Center>

      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <Grid mb="xl">
          <Grid.Col span={6}>
            <TextInput label="Họ và tên" {...form.getInputProps("name")} />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput label="Email" {...form.getInputProps("email")} disabled />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput label="Số điện thoại" {...form.getInputProps("phone")} />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput label="Địa chỉ" {...form.getInputProps("address")} />
          </Grid.Col>
        </Grid>

        <Button type="submit" loading={isLoadingSubmit}>
          Cập nhật
        </Button>
      </form>
    </Layout>
  );
};
