import Image, { ImageProps } from "next/image";
import React from "react";

export default function ChatImage(props: ImageProps) {
  const [size, setSize] = React.useState({ width: 300, height: 300 });
  return (
    <Image
      {...props}
      alt={props.alt || "image"}
      width={size.width}
      height={size.height}
      onLoadingComplete={(img) =>
        setSize({ width: img.naturalWidth, height: img.naturalHeight })
      }
      className={"w-full h-auto " + (props.className ?? "")}
    />
  );
}