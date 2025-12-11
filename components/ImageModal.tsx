"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Search } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface ImageModalProps {
  src: string;
  children: React.ReactNode;
}

export default function ImageModal({ src, children }: ImageModalProps) {
    const [zoomed, setZoomed] = React.useState(false);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleZoom = () => {
    setZoomed((z) => !z);
    if (zoomed && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 w-[90vw] max-w-3xl flex items-center justify-center">
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <div
          ref={containerRef}
          className={cn("relative w-full h-[90vh]", zoomed && "overflow-auto cursor-grab")}
        >
          <Image
            src={src}
            alt="image"
            quality={100}
            fill={!zoomed}
            width={zoomed ? size.width : undefined}
            height={zoomed ? size.height : undefined}
            className={zoomed ? "select-none" : "object-cover"}
            onLoadingComplete={(img) =>
              setSize({ width: img.naturalWidth, height: img.naturalHeight })
            }
          />
          <button
            type="button"
            onClick={toggleZoom}
            className="absolute left-2 bottom-2 p-1 rounded bg-black/50 text-white"
          >
            <Search className="w-4 h-4" />
            <span className="sr-only">Toggle zoom</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
