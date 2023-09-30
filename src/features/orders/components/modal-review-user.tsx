import { Button, Group, Modal, type ModalProps, Rating, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { type ReviewService, type TransactionOrderType } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { type ForwardRefRenderFunction, forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";

import { api } from "../../../utils/api";

type Props = Omit<ModalProps, "opened" | "onClose"> & {
  onSuccess: () => void;
  type: TransactionOrderType;
};
type Ref = {
  openDrawer: (_userBeReviewedId: string, _orderId: string, _isFreelancer: boolean) => void;
  closeDrawer: () => void;
};
type PropsForm = Omit<ReviewService, "createdAt" | "updatedAt" | "reviewerId" | "serviceId">;

const formSchema = z.object({
  comment: z.string().min(1, { message: "Vui lòng nhập bình luận của bạn" }),
});

const _ModalReviewUser: ForwardRefRenderFunction<Ref, Props> = ({ onSuccess, type, ...props }, ref) => {
  const { data: session } = useSession();
  const { mutateAsync: submitReviewFreelancer, isLoading: isLoadingReviewFreelance } =
    api.review.createReviewFreelancer.useMutation();
  const { mutateAsync: submitReviewClient, isLoading: isLoadingReviewClient } =
    api.review.createReviewClient.useMutation();
  const [opened, setOpened] = useState(false);
  const [userIdBeReviewed, setUserIdBeReviewed] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);

  const form = useForm<PropsForm>({
    initialValues: {
      comment: "",
      rating: 0,
    },
    validate: zodResolver(formSchema),
  });

  useImperativeHandle(ref, () => ({
    openDrawer: (_userBeReviewedId, _orderId, _isFreelancer) => {
      setOpened(true);

      setIsFreelancer(_isFreelancer);
      setUserIdBeReviewed(_userBeReviewedId);
      setOrderId(_orderId);
    },
    closeDrawer: handleClose,
  }));

  const handleClose = () => {
    setOpened(false);
    setUserIdBeReviewed("");
    setIsFreelancer(false);
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
      const data = {
        ...values,
        reviewerId: session?.user?.id || "",
        userIdDoReview: session?.user?.id || "",
        userIdBeReviewed,
        orderId,
        type,
      };

      if (isFreelancer) await submitReviewClient(data);
      else await submitReviewFreelancer(data);

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
    <Modal
      {...props}
      opened={opened}
      onClose={handleClose}
      title={`Đánh giá ${!isFreelancer ? "freelancer" : "khách hàng"}`}
    >
      <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
        <Rating {...form.getInputProps("rating")} my="xl" />

        <Textarea {...form.getInputProps("comment")} label="Bình luận" />

        <Group position="right" mt="xl">
          <Button loading={isLoadingReviewFreelance || isLoadingReviewClient} type="submit">
            Gửi bình luận
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export const ModalReviewUser = forwardRef<Ref, Props>(_ModalReviewUser);
