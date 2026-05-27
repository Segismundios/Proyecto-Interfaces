// Client component: Radix Dialog gestiona focus trap, Escape y scroll lock
// en el browser; no puede ser Server Component.
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay: oscurece el fondo (Gestalt figura/fondo) */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content: Radix maneja focus trap, Escape y aria-labelledby */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 bg-gh-canvas-subtle border border-gh-border rounded-lg shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gh-border">
            <Dialog.Title className="text-base font-semibold text-gh-fg">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="text-gh-fg-muted hover:text-gh-fg transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gh-accent p-0.5"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
