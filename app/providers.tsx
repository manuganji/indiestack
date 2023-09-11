"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  AuthContextValueType,
  AuthProvider,
} from "@/components/auth/SessionProvider";
import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* <Toaster className="dark:hidden" /> */}
      {/* <Toaster theme="dark" className="hidden dark:block" /> */}
      {/* <ModalProvider>{children}</ModalProvider> */}
      <div className="place-self-end p-2">
        <ModeToggle />
      </div>
      {children}
    </ThemeProvider>
  );
}
