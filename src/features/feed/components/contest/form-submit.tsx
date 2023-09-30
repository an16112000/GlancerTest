import { Box, Button, Divider, LoadingOverlay, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import React, { useMemo, useState } from "react";
import { ZodError, z } from "zod";

import { FormLabel, Gallery } from "../../../../components";
import { uploadFile } from "../../../../helpers";
import { useRefPortal } from "../../../../hooks";
import { api } from "../../../../utils/api";
import { notiAction } from "../../../../utils/notificator";

const formSchema = z.object({
  url: z.string().url(),
});

type Props = {
  contestId?: string;
  onSuccess: () => Promise<void>;
};

export const FormSubmit: React.FC<Props> = ({ onSuccess, contestId }) => {
  const { data: session } = useSession();
  const { mutateAsync: apiCreate } = api.productContest.create.useMutation();
  const { mutateAsync: apiDelete } = api.productContest.delete.useMutation();
  const galleryRef = useRefPortal<typeof Gallery>();
  const [urlValue, setUrlValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    data: listProduct,
    isLoading,
    refetch,
  } = api.productContest.getProductListByContest.useQuery(
    {
      contestId: contestId || "",
      freelancerId: session?.user?.id || "",
    },
    {
      enabled: !!contestId && !!session?.user?.id,
      refetchOnWindowFocus: false,
    },
  );

  const submittedProduct = useMemo(() => (listProduct && listProduct[0] ? listProduct[0] : undefined), [listProduct]);

  const handleSubmit = async () => {
    if (session && session.user && contestId) {
      const galleryFiles: File[] = galleryRef.current?.files || [];

      try {
        let url = "";
        let gallery = "";

        if (!galleryFiles.length && !urlValue) {
          return showNotification({
            color: "red",
            message: "Vui lòng nhập url hoặc thêm ít nhất 3 ảnh mẫu",
          });
        }

        if (urlValue) {
          await formSchema.parseAsync({ url: urlValue });

          url = urlValue;
        }

        setIsSubmitting(true);

        if (galleryFiles.length) {
          gallery = await uploadGallery(galleryFiles);
        }

        const data = {
          url,
          gallery,
          contestId,
          freelancerId: session.user.id,
        };

        await apiCreate(data);

        await refetch();

        await onSuccess();

        setUrlValue("");

        galleryRef.current?.setFiles([]);
        galleryRef.current?.setGallery([]);

        notiAction({ subject: "Nộp sản phẩm" });
      } catch (error) {
        console.log(error);

        if (error instanceof ZodError) {
          showNotification({
            color: "red",
            message: "Link không hợp lệ",
          });
        } else {
          notiAction({ isFailed: true, subject: "Nộp sản phẩm" });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const uploadGallery = async (files: File[]) => {
    if (files.length < 3) {
      showNotification({
        color: "red",
        message: "Vui lòng thêm ít nhất 3 ảnh mẫu",
      });

      throw "Not enough images";
    }

    console.log("Uploading gallery...");

    const uploadedGallery = await Promise.all(files.map((file) => uploadFile(file)));

    if (uploadedGallery.some((image) => !image)) throw Error("Uploaded gallery is maybe undefined");

    console.log("Uploading gallery success", uploadedGallery);

    return JSON.stringify(uploadedGallery);
  };

  const handleDelete = async () => {
    if (submittedProduct) {
      try {
        setIsDeleting(true);

        await apiDelete({ id: submittedProduct.id });

        await refetch();

        await onSuccess();

        notiAction({ subject: "Gỡ sản phẩm" });
      } catch (error) {
        console.log(error);

        notiAction({ subject: "Gỡ sản phẩm", isFailed: true });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return isLoading ? (
    <Box pos="relative" h={200}>
      <LoadingOverlay visible={isLoading} />
    </Box>
  ) : (
    <>
      <Divider mb="md" />

      {!!submittedProduct && submittedProduct.gallery && <FormLabel mb="xs">Ảnh mẫu</FormLabel>}

      <Gallery
        gridSize="big"
        ref={galleryRef}
        readOnly={!!submittedProduct}
        initJsonValues={submittedProduct?.gallery}
      />

      <TextInput
        label="Link"
        mt="xs"
        placeholder="https://example.com/..."
        value={submittedProduct ? submittedProduct.url || "" : urlValue}
        onChange={(e) => setUrlValue(e.target.value)}
        readOnly={!!submittedProduct}
      />

      {!submittedProduct ? (
        <Button fullWidth mt="lg" onClick={() => void handleSubmit()} loading={isSubmitting}>
          Nộp sản phẩm
        </Button>
      ) : (
        <Button fullWidth color="red" mt="lg" onClick={() => void handleDelete()} loading={isDeleting}>
          Gỡ sản phẩm
        </Button>
      )}
    </>
  );
};
