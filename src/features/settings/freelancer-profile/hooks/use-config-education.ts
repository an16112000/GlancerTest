import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { Education } from "@prisma/client";
import moment from "moment";
import { useState } from "react";
import { z } from "zod";

import { api } from "../../../../utils/api";
import { genTextCreateOrUpdate } from "../../../../utils/generator";
import { notiConfig } from "../../../../utils/notificator";
import type { PropsConfig } from "../types";

type PropsForm = {
  school: string;
  from?: Date | null;
  to?: Date | null;
  description?: string;
  area?: string;
  degreeId?: string;
};

const formSchema = z.object({
  school: z.string().min(1, { message: "Vui lòng điền tên trường" }),
});

export const useConfigEducation = ({ profile, onSuccess, onCloseDrawer = () => undefined }: PropsConfig) => {
  const { mutateAsync: apiCreate } = api.education.create.useMutation();
  const { mutateAsync: apiUpdate } = api.education.update.useMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [initData, setInitData] = useState<Education | undefined>();
  const [isLearning, setIsLearning] = useState(true);
  const [rerenderDatePickerTo, setRerenderDatePickerTo] = useState(false);

  const configText = genTextCreateOrUpdate(!!initData);

  const form = useForm<PropsForm>({
    initialValues: {
      school: "",
      area: "",
      description: "",
    },
    validate: zodResolver(formSchema),
  });

  const initForm = (data?: Education) => {
    setInitData(data);

    if (data) {
      setIsLearning(!data.to);

      form.setFieldValue("school", data.school);
      form.setFieldValue("area", data.area || "");
      form.setFieldValue("description", data.description || "");
      form.setFieldValue("degreeId", data.degreeId || undefined);

      initFromDate(data.from);
      initToDate(data.to);
    }
  };

  const initFromDate = (from: string | null) => {
    if (from) {
      const fromDate = moment(from, "DD/MM/YYYY").toDate();

      form.setFieldValue("from", fromDate);
    }
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

      notiConfig({ isUpdate: !!initData, subject: "học vấn" });

      onCloseDrawer();
    } catch (error) {
      console.log(error);

      notiConfig({ isUpdate: !!initData, isFailed: true, subject: "học vấn" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFromToValid = (from?: Date | null, to?: Date | null) => {
    let iValid = true;

    if (from && to) {
      const fromMoment = moment(from);
      const toMoment = moment(to);

      if (fromMoment.isSameOrAfter(toMoment)) {
        iValid = false;
      }
    }

    if (!from && to) {
      iValid = false;
    }

    if (!iValid) {
      showNotification({
        color: "red",
        message: "Ngày bắt đầu và ngày kết thúc không hợp lệ!",
      });
    }

    return iValid;
  };

  const convertFromToValuesToString = (from?: Date | null, to?: Date | null) => {
    let fromString = "";
    let toString = "";

    if (from) {
      fromString = moment(from).format("DD/MM/YYYY");
    }

    if (to) {
      toString = moment(to).format("DD/MM/YYYY");
    }

    return { from: fromString, to: toString };
  };

  const onCheckLearningStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setIsLearning(checked);

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
    setIsLearning(true);
    setRerenderDatePickerTo(false);
    onCloseDrawer();
  };

  const onSubmit = form.onSubmit((values) => void handleSubmit(values));

  return {
    form,
    initForm,
    resetData,
    onSubmit,
    configText,
    isLearning,
    isLoading,
    rerenderDatePickerTo,
    onCheckLearningStatus,
  };
};
