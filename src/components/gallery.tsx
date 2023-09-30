import { AspectRatio, Box, type ColorScheme, FileButton, Grid, LoadingOverlay } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons";
import { nanoid } from "nanoid";
import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { keys } from "../constants";
import { convertFileToBase64 } from "../utils/converter";
import { GalleryImage } from "./gallery-image";

type RefGallery = {
  files: Array<File>;
  gallery: Array<string>;
  setGallery: (images: string[]) => void;
  setFiles: React.Dispatch<React.SetStateAction<IGalleryFile[]>>;
};
type PropsGallery = {
  gridSize?: "small" | "big";
  initJsonValues?: string | null;
  readOnly?: boolean;
};

interface IGalleryImage {
  id: string;
  image: string;
}
interface IGalleryFile {
  id: string;
  file: File;
}

const _Gallery: ForwardRefRenderFunction<RefGallery, PropsGallery> = (
  { gridSize = "small", initJsonValues, readOnly = false },
  ref,
) => {
  const [theme] = useLocalStorage<ColorScheme>({ key: keys.COLOR_SCHEME });
  const [gallery, setGallery] = useState<Array<IGalleryImage>>([]);
  const [files, setFiles] = useState<Array<IGalleryFile>>([]);
  const [isImagesUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    if (initJsonValues) {
      const parsedValue = JSON.parse(initJsonValues) as string[];

      handleInitGallery(parsedValue);
    }
  }, [initJsonValues]);

  useImperativeHandle(ref, () => ({
    files: files.map((item) => item.file),
    gallery: gallery.map((item) => item.image),
    setGallery: handleInitGallery,
    setFiles,
  }));

  const handleInitGallery = (images: string[]) => {
    setGallery(images.map((image) => ({ id: nanoid(), image })));
  };

  const handleUploadGallery = async (files: File[]) => {
    if (!files.length) return;

    const invalidImageNames: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      const isValid = file.size / keys.MAX_FILE_SIZE_KB / keys.MAX_FILE_SIZE_KB < 1;

      if (!isValid) {
        invalidImageNames.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidImageNames.length) {
      showNotification({
        color: "red",
        title: `Kích thước ảnh phải nhỏ hơn ${keys.MAX_FILE_SIZE_MB}MB`,
        message: `Ảnh ${invalidImageNames.join(", ")} không hợp lệ`,
      });
    }

    if (!validFiles.length) return;

    try {
      setIsImageUploading(true);

      const listBase64 = await Promise.all(validFiles.map((file: File) => convertFileToBase64(file)));

      const listId = Array(validFiles.length)
        .fill(null)
        .map(() => nanoid());

      setFiles((arr) => [...arr, ...validFiles.map((file, index) => ({ id: listId[index] || "", file }))]);

      setGallery((arr) => [...arr, ...listBase64.map((image, index) => ({ id: listId[index] || "", image }))]);
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

  const handleDeleteImage = (index: number) => {
    let deletedId: string | undefined;

    setGallery((arr) => {
      deletedId = arr[index]?.id;
      const tempArr = [...arr];
      tempArr.splice(index, 1);
      return tempArr;
    });

    setFiles((arr) => {
      return arr.filter((item) => item.id === deletedId);
    });
  };

  const gridColSize = useMemo(() => {
    if (gridSize === "big") {
      return {
        span: 4,
        sm: 3,
        lg: 2,
      };
    }

    return {
      span: 3,
      sm: 2,
      lg: 1,
    };
  }, [gridSize]);

  return (
    <Grid gutter="xs" p={0}>
      <LoadingOverlay visible={isImagesUploading} />

      {!readOnly && (
        <Grid.Col {...gridColSize}>
          <FileButton
            onChange={(files: File[]) => void handleUploadGallery(files)}
            accept="image/png,image/jpg,image/jpeg,image/webp"
            multiple
          >
            {({ onClick }) => (
              <AspectRatio onClick={onClick} ratio={1} w="100%" sx={{ cursor: "pointer" }}>
                <Box
                  sx={{
                    border: `1px dashed ${theme === "light" ? "rgb(134, 142, 150)" : "rgb(144, 146, 150)"}`,
                    borderRadius: 5,
                  }}
                >
                  <IconPlus color={theme === "light" ? "rgb(134, 142, 150)" : "rgb(144, 146, 150)"} />
                </Box>
              </AspectRatio>
            )}
          </FileButton>
        </Grid.Col>
      )}

      {gallery.map((item, index) => (
        <Grid.Col key={nanoid()} {...gridColSize}>
          <GalleryImage
            url={item.image}
            onDelete={() => {
              handleDeleteImage(index);
            }}
            readOnly={readOnly}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

const FwrGallery = forwardRef<RefGallery, PropsGallery>(_Gallery);

export const Gallery = memo(FwrGallery);
