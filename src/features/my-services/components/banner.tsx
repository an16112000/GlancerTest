import React, { type ForwardRefRenderFunction, forwardRef, memo, useImperativeHandle } from "react";
import { AspectRatio, FileButton, Button, LoadingOverlay } from "@mantine/core";
import { ImagePlaceholder } from "../../../components";
import { useState } from "react";
import Image from "next/image";
import { convertFileToBase64 } from "../../../utils/converter";
import { showNotification } from "@mantine/notifications";
import { keys } from "../../../constants";

type RefBanner = {
  file: File | null;
  banner: string | null;
  setBanner: React.Dispatch<React.SetStateAction<string | null>>;
};

const _Banner: ForwardRefRenderFunction<RefBanner> = (_props, ref) => {
  const [banner, setBanner] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useImperativeHandle(ref, () => ({ file, banner, setBanner }));

  const handleUploadBanner = async (file: File) => {
    if (!file) return;

    const isValid = file.size / keys.MAX_FILE_SIZE_KB / keys.MAX_FILE_SIZE_KB < 1;

    if (!isValid) {
      return showNotification({
        color: "red",
        message: `Kích thước ảnh phải nhỏ hơn ${keys.MAX_FILE_SIZE_MB}MB`,
      });
    }

    try {
      setIsImageUploading(true);

      const base64 = await convertFileToBase64(file);

      setFile(file);

      setBanner(base64);
    } catch (error) {
      console.log(error);

      showNotification({
        color: "red",
        message: "Tải ảnh lên thất bại",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isImageUploading} />

      <AspectRatio ratio={1} w="100%" mb="sm" sx={{ borderRadius: 5, overflow: "hidden" }}>
        {banner ? <Image alt="" fill src={banner} /> : <ImagePlaceholder />}
      </AspectRatio>

      <FileButton
        onChange={(file: File) => void handleUploadBanner(file)}
        accept="image/png,image/jpg,image/jpeg,image/webp"
      >
        {(props) => (
          <Button fullWidth {...props}>
            Cập nhật ảnh bìa
          </Button>
        )}
      </FileButton>
    </>
  );
};

const FwrBanner = forwardRef<RefBanner>(_Banner);

export const Banner = memo(FwrBanner);
