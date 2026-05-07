"use client";

import { motion } from "framer-motion";

type MascotProps = {
  src: string;
  alt: string;
  width: number;
  className?: string;
  priority?: boolean;
};

const breathe = {
  scale: [1, 1.02, 1],
};

export function Mascot({
  src,
  alt,
  width,
  className = "",
}: MascotProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={breathe}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width }}
    >
      {/* Mascot art: native img keeps correct aspect ratio */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        className="h-auto w-full select-none drop-shadow-warm"
        draggable={false}
      />
    </motion.div>
  );
}
