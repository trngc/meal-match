"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { RESTAURANT_IMAGE_FALLBACK } from "@/lib/mockData";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

export function RestaurantImage({ src, alt, ...rest }: Props) {
  const [resolved, setResolved] = useState(src);

  useEffect(() => {
    setResolved(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      onError={() => {
        setResolved((u) =>
          u === RESTAURANT_IMAGE_FALLBACK ? u : RESTAURANT_IMAGE_FALLBACK,
        );
      }}
    />
  );
}
