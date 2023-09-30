import { Avatar, type AvatarProps, Box, Center, FileButton, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconEdit } from "@tabler/icons";
import React, { useState } from "react";

import { keys } from "../../../constants";
import { convertFileToBase64 } from "../../../utils/converter";

type Props = AvatarProps & {
  setFile: (file: File) => void;
  setAvatar: (base64: string) => void;
};

export const AvatarUser: React.FC<Props> = ({ setAvatar, setFile, ...props }) => {
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleUploadAvatar = async (file: File) => {
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

      setAvatar(base64);
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
    <FileButton
      onChange={(file: File) => void handleUploadAvatar(file)}
      accept="image/png,image/jpg,image/jpeg,image/webp"
    >
      {({ onClick }) => (
        <Box
          pos="relative"
          sx={{ cursor: !isImageUploading ? "pointer" : "default" }}
          onClick={!isImageUploading ? onClick : () => undefined}
        >
          <LoadingOverlay visible={isImageUploading} />

          <Avatar size="xl" radius={0} {...props} />

          <Center pos="absolute" bottom={0} left={0} w="100%" bg="#00000050" py={5}>
            <IconEdit size="1rem" color="#fff" />
          </Center>
        </Box>
      )}
    </FileButton>
  );
};
