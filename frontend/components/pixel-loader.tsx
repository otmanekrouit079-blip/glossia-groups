"use client";

import { useEffect } from "react";

import { loadPixelsDeferred } from "@/lib/pixels/load";

export function PixelLoader() {
  useEffect(() => {
    loadPixelsDeferred();
  }, []);

  return null;
}
