import { AspectRatio, Transition, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconX } from "@tabler/icons";
import Image from "next/image";
import React, { memo } from "react";

type Props = {
  url: string;
  onDelete: () => void;
  readOnly: boolean;
};

const _GalleryImage: React.FC<Props> = ({ url, onDelete, readOnly = false }) => {
  const { hovered, ref } = useHover();

  return (
    <AspectRatio ref={ref} ratio={1} w="100%" sx={{ borderRadius: 5, overflow: "hidden" }}>
      {readOnly ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Image alt="" fill src={url} />
        </a>
      ) : (
        <Image alt="" fill src={url} />
      )}

      {!readOnly && (
        <Transition mounted={hovered} transition="fade" duration={400} timingFunction="ease">
          {(styles) => (
            <UnstyledButton style={styles} bg="#00000099" onClick={onDelete}>
              <IconX color="#fff" size={30} />
            </UnstyledButton>
          )}
        </Transition>
      )}
    </AspectRatio>
  );
};

export const GalleryImage = memo(_GalleryImage);
