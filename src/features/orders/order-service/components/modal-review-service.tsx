import { Button, Group, Modal, type ModalProps, Rating, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { ReviewService } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";

import { api } from "../../../../utils/api";

type Props = Omit<ModalProps, "opened" | "onClose"> & {
  onSuccess: () => void;
};
type Ref = {
  openDrawer: (_serviceId: string, _orderId: string) => void;
  closeDrawer: () => void;
};
type PropsForm = Omit<ReviewService, "createdAt" | "updatedAt" | "reviewerId" | "serviceId">;

const formSchema = z.object({
  comment: z.string().min(1, { message: "Vui lòng nhập bình luận của bạn" }),
});

const _ModalReviewService: ForwardRefRenderFunction<Ref, Props> = ({ onSuccess, ...props }, ref) => {
  const { data: session } = useSession();
  const { mutateAsync: submitReview, isLoading } = api.review.createReviewService.useMutation();
  const [opened, setOpened] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [orderId, setOrderId] = useState("");

  const form = useForm<PropsForm>({
    initialValues: {
      comment: "",
      rating: 0,
    },
    validate: zodResolver(formSchema),
  });

  useImperativeHandle(ref, () => ({
    openDrawer: (_serviceId, _orderId) => {
      setOpened(true);

      setServiceId(_serviceId);
      setOrderId(_orderId);
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setServiceId("");
    setOrderId("");
    form.reset();
  };

  const handleSubmit = async (values: PropsForm) => {
    if (!values.rating) {
      return showNotification({
        color: "orange",
        message: `Vui lòng chọn đánh giá!`,
      });
    }

    try {
      await submitReview({ ...values, reviewerId: session?.user?.id || "", serviceId, orderId });

      showNotification({
        color: "green",
        message: `Gửi bình luận thành công!`,
      });

      onSuccess();

      handleClose();
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: `Gửi bình luận thất bại!`,
      });
    }
  };

  return (
    <Modal {...props} opened={opened} onClose={handleClose} title="Đánh giá dịch vụ">
      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <Rating {...form.getInputProps("rating")} my="xl" />

        <Textarea {...form.getInputProps("comment")} label="Bình luận" />

        <Group position="right" mt="xl">
          <Button loading={isLoading} type="submit">
            Gửi bình luận
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export const ModalReviewService = forwardRef<Ref, Props>(_ModalReviewService);
