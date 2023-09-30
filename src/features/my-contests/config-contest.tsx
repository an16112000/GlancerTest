import { Button, Drawer, type DrawerProps, Group, LoadingOverlay, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { Contest } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";

import { InputPrice, SelectCategory, TextEditor } from "../../components";
import { useRefTinyMCE } from "../../hooks";
import { api } from "../../utils/api";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  onSuccess: () => Promise<void>;
};
type Ref = {
  openDrawer: (data?: Contest) => void;
  closeDrawer: () => void;
};
type PropsForm = {
  name: string;
  budget: number;
  categoryId: string;
  dueDate?: Date | null;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng điền tên dịch vụ" }),
  budget: z.number({ required_error: "Vui lòng điền giá dịch vụ" }),
  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
});

const _ConfigContest: ForwardRefRenderFunction<Ref, Props> = ({ onSuccess, ...props }, ref) => {
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
  const [initData, setInitData] = useState<Contest | undefined>();
  const editorRef = useRefTinyMCE();
  const { mutateAsync: apiCreate, isLoading: loadingCreate } = api.contest.create.useMutation();
  const { mutateAsync: apiUpdate, isLoading: loadingUpdate } = api.contest.update.useMutation();

  const form = useForm<PropsForm>({
    initialValues: {
      name: "",
      budget: 0,
      categoryId: "",
      dueDate: null,
    },
    validate: zodResolver(formSchema),
  });

  useImperativeHandle(ref, () => ({
    openDrawer: (data) => {
      setOpened(true);

      if (data) {
        setInitData(data);

        form.setFieldValue("name", data.name);
        form.setFieldValue("categoryId", data.categoryId);
        form.setFieldValue("budget", data.budget);

        if (!!data.dueDate) {
          form.setFieldValue("dueDate", moment(data.dueDate, "DD/MM/YYYY").toDate());
        }
      }
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    form.reset();
    setInitData(undefined);
  };

  const handleSubmit = async (values: PropsForm) => {
    const info = editorRef.current?.getContent() || "";
    let dueDate = "";

    if (!!values.dueDate) {
      const dueDateMoment = moment(values.dueDate);

      if (dueDateMoment.isSameOrBefore(moment())) {
        return showNotification({
          color: "red",
          message: "Ngày kết thúc không hợp lệ!",
        });
      }

      dueDate = dueDateMoment.format("DD/MM/YYYY");
    }

    const data = {
      ...values,
      info,
      ownerId: session?.user?.id || "",
      dueDate,
    };

    console.log(data);

    try {
      if (!initData) await apiCreate(data);
      else await apiUpdate({ ...data, id: initData.id });

      showNotification({
        color: "green",
        message: `${!initData ? "Thêm mới" : "Cập nhật"} thành công!`,
      });

      await onSuccess();

      handleClose();
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: `${!initData ? "Thêm mới" : "Cập nhật"} thất bại!`,
      });
    }
  };

  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={handleClose}
      title={<Title order={2}>{!initData ? "Thêm mới" : "Cập nhật"} cuộc thi</Title>}
      padding="xl"
      size={1000}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />

      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <TextInput withAsterisk label="Tên cuộc thi" {...form.getInputProps("name")} mb="sm" />

        <Group align="start" grow mb="sm">
          <SelectCategory withAsterisk {...form.getInputProps("categoryId")} clearable={false} />

          <InputPrice withAsterisk label="Mức chi" {...form.getInputProps("budget")} />

          <DatePicker label="Ngày kết thúc" placeholder="DD/MM/YYYY" {...form.getInputProps("dueDate")} />
        </Group>

        <TextEditor editorRef={editorRef} label="Thông tin" initData={initData?.info} withAsterisk />

        <Group position="right">
          <Button mt="xl" type="submit">
            {!initData ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Group>
      </form>
    </Drawer>
  );
};

export const ConfigContest = forwardRef<Ref, Props>(_ConfigContest);
