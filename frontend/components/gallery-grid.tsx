"use client";

import { useEffect, useState } from "react";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { resolveImageUrl } from "@/lib/api";

type GalleryItem = {
  id: string;
  name: string;
  image: string;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length]);

  return (
    <>
      <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
        {items.map((item, index) => {
          const imageSrc = resolveImageUrl(item.image);
          const large = index === 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`card card-hover group relative overflow-hidden p-0 text-right ${
                large ? "col-span-2 row-span-2" : ""
              }`}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <ImagePlaceholder className="h-full w-full" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="font-heading text-sm font-bold text-white">{item.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="سد"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl text-white"
          >
            ✕
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === null ? i : (i + 1) % items.length));
                }}
                aria-label="التالي"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-xl text-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
                }}
                aria-label="السابق"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-xl text-white"
              >
                ›
              </button>
            </>
          ) : null}

          <div className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const item = items[activeIndex];
              const imageSrc = resolveImageUrl(item.image);
              return imageSrc ? (
                <img src={imageSrc} alt={item.name} className="max-h-[75vh] w-full rounded-2xl object-contain" />
              ) : (
                <ImagePlaceholder className="h-[50vh] w-[50vw] rounded-2xl" />
              );
            })()}
            <p className="mt-4 text-center font-heading text-lg font-bold text-white">{items[activeIndex].name}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
