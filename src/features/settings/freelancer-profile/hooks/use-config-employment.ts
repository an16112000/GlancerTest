import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { Employment } from "@prisma/client";
import moment from "moment";
import { useState } from "react";
import { z } from "zod";

import { api } from "../../../../utils/api";
import { genTextCreateOrUpdate } from "../../../../utils/generator";
import { notiConfig } from "../../../../utils/notificator";
import type { PropsConfig } from "../types";

type PropsForm = {
  company: string;
  address: string;
  title: string;
  description?: string;
  from?: Date | null;
  to?: Date | null;
};

const formSchema = z.object({
  company: z.string().min(1, { message: "Vui lòng điền tên công ty" }),
  address: z.string().min(1, { message: "Vui lòng điền địa chỉ công ty" }),
  title: z.string().min(1, { message: "Vui lòng điền chức danh" }),
  from: z.date({ required_error: "Vui lòng chọn ngày vào làm", invalid_type_error: "Vui lòng chọn ngày vào làm" }),
});

export const useConfigEmployment = ({ profile, onSuccess, onCloseDrawer = () => undefined }: PropsConfig) => {
  const { mutateAsync: apiCreate } = api.employment.create.useMutation();
  const { mutateAsync: apiUpdate } = api.employment.update.useMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [initData, setInitData] = useState<Employment | undefined>();
  const [isWorking, setIsWorking] = useState(true);
  const [rerenderDatePickerTo, setRerenderDatePickerTo] = useState(false);

  const configText = genTextCreateOrUpdate(!!initData);

  const form = useForm<PropsForm>({
    initialValues: {
      company: "",
      address: "",
      title: "",
      description: "",
    },
    validate: zodResolver(formSchema),
  });

  const initForm = (data?: Employment) => {
    setInitData(data);

    if (data) {
      setIsWorking(!data.to);
      form.setFieldValue("company", data.company);
      form.setFieldValue("address", data.address);
      form.setFieldValue("title", data.title);
      form.setFieldValue("description", data.description || "");

      initFromDate(data.from);
      initToDate(data.to);
    }
  };

  const initFromDate = (from: string) => {
    const fromDate = moment(from, "DD/MM/YYYY").toDate();

    form.setFieldValue("from", fromDate);
  };

  const initToDate = (to: string | null) => {
    if (to) {
      const toDate = moment(to, "DD/MM/YYYY").toDate();

      form.setFieldValue("to", toDate);
    }
  };

  const handleSubmit = async (values: PropsForm) => {
    if (!isFromToValid(values.from, values.to)) return;

    try {
      setIsLoading(true);

      const { from, to } = convertFromToValuesToString(values.from, values.to);

      const data = {
        ...values,
        from,
        to,
        profileId: profile.id,
      };

      if (initData) {
        await apiUpdate({ ...data, id: initData.id });
      } else {
        await apiCreate(data);
      }

      await onSuccess();

      notiConfig({ isUpdate: !!initData, subject: "kinh nghiệm làm việc" });

      onCloseDrawer();
    } catch (error) {
      console.log(error);

      notiConfig({ isUpdate: !!initData, isFailed: true, subject: "kinh nghiệm làm việc" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFromToValid = (from?: Date | null, to?: Date | null) => {
    let isValid = true;

    if (from && to) {
      const fromMoment = moment(from);
      const toMoment = moment(to);

      if (fromMoment.isAfter(toMoment)) {
        isValid = false;

        showNotification({
          color: "red",
          message: "Ngày bắt đầu và ngày kết thúc không hợp lệ!",
        });
      }
    }

    return isValid;
  };

  const convertFromToValuesToString = (from?: Date | null, to?: Date | null) => {
    const fromString = moment(from).format("DD/MM/YYYY");

    let toString = "";

    if (to) {
      toString = moment(to).format("DD/MM/YYYY");
    }

    return { from: fromString, to: toString };
  };

  const onCheckWorkingStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setIsWorking(checked);

    if (checked) {
      form.setFieldValue("to", undefined);

      resetUIdatePickerTo();
    }
  };

  const resetUIdatePickerTo = () => {
    setRerenderDatePickerTo(true);

    setTimeout(() => {
      setRerenderDatePickerTo(false);
    }, 1);
  };

  const resetData = () => {
    form.reset();
    setIsLoading(false);
    setInitData(undefined);
    setIsWorking(true);
    setRerenderDatePickerTo(false);
    onCloseDrawer();
  };

  const onSubmit = form.onSubmit((values) => void handleSubmit(values));

  return {
    form,
    resetData,
    onCheckWorkingStatus,
    configText,
    initForm,
    onSubmit,
    isLoading,
    isWorking,
    rerenderDatePickerTo,
  };
};
