import { Button, Checkbox, Drawer, type DrawerProps, Grid, TextInput, Textarea, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import type { Employment, FreelancerProfile } from "@prisma/client";
import React, { type ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle, useState } from "react";

import { useConfigEmployment } from "../hooks";

type Props = Omit<DrawerProps, "onClose" | "opened"> & {
  profile: FreelancerProfile;
  onSuccess: () => Promise<void>;
};

type Ref = {
  openDrawer: (data?: Employment) => void;
  closeDrawer: () => void;
};

const _ConfigEmployment: ForwardRefRenderFunction<Ref, Props> = ({ profile, onSuccess, ...props }, ref) => {
  const [opened, setOpened] = useState(false);
  const {
    form,
    resetData,
    onCheckWorkingStatus,
    configText,
    initForm,
    onSubmit,
    isLoading,
    isWorking,
    rerenderDatePickerTo,
  } = useConfigEmployment({ profile, onSuccess, onCloseDrawer: () => setOpened(false) });

  useImperativeHandle(ref, () => ({
    openDrawer: (data) => {
      setOpened(true);

      initForm(data);
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    resetData();
  };

  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={handleClose}
      title={<Title order={2}>{configText} kinh nghiệm làm việc</Title>}
      padding="xl"
      size={550}
    >
      <form onSubmit={onSubmit}>
        <Grid mb="sm" align="center">
          <Grid.Col span={12}>
            <TextInput label="Tên công ty" {...form.getInputProps("company")} withAsterisk />
          </Grid.Col>

          <Grid.Col span={12}>
            <DatePicker {...form.getInputProps("from")} label="Từ ngày" withAsterisk />
          </Grid.Col>

          <Grid.Col span={3}>
            <Checkbox checked={isWorking} onChange={onCheckWorkingStatus} label="Đang làm" mt="xl" />
          </Grid.Col>

          <Grid.Col span={9}>
            {!rerenderDatePickerTo && (
              <DatePicker {...form.getInputProps("to")} label="Đến ngày" disabled={isWorking} />
            )}
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Chức danh" {...form.getInputProps("title")} withAsterisk />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput label="Địa chỉ" {...form.getInputProps("address")} withAsterisk />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea label="Mô tả" {...form.getInputProps("description")} />
          </Grid.Col>
        </Grid>

        <Button type="submit" loading={isLoading}>
          {configText}
        </Button>
      </form>
    </Drawer>
  );
};

const __ConfigEmployment = forwardRef<Ref, Props>(_ConfigEmployment);

export const ConfigEmployment = memo(__ConfigEmployment);
