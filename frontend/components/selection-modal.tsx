"use client";

import { ReactNode, useEffect, useState } from "react";

type SelectionModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function SelectionModal({ open, title, onClose, children }: SelectionModalProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:p-4 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`card w-full max-w-lg rounded-b-none p-0 transition-all duration-200 sm:rounded-2xl ${
          entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-borderline p-4">
          <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="سد"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-borderline text-lg text-ink transition hover:border-brass"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
