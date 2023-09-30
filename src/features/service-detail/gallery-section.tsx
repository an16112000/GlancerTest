import { Carousel } from "@mantine/carousel";
import { AspectRatio } from "@mantine/core";
import { nanoid } from "nanoid";
import Image from "next/image";
import React from "react";

type Props = {
  galleryJson?: string;
};

export const GallerySection: React.FC<Props> = ({ galleryJson = "" }) => {
  const gallery = React.useMemo(() => {
    if (!galleryJson) return [];
    return JSON.parse(galleryJson) as Array<string>;
  }, [galleryJson]);

  return (
    <Carousel align="start" withIndicators>
      {gallery.map((item) => (
        <Carousel.Slide key={nanoid()}>
          <AspectRatio ratio={2}>
            <Image alt="" fill src={item} />
          </AspectRatio>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
