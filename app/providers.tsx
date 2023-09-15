"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  AuthContextValueType,
  AuthProvider,
} from "@/components/auth/SessionProvider";
import { ThemeProvider } from "next-themes";
import { Fragment } from "react";
// import { Toaster } from "sonner";
// import { ModalProvider } from "@/components/modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  // {/* <ThemeProvider> */}
  //       {/* <Toaster className="dark:hidden" /> */}
  //       {/* <Toaster theme="dark" className="hidden dark:block" /> */}
  //       {/* <ModalProvider>{children}</ModalProvider> */}
  // {/* </ThemeProvider> */}
  return (
    <Fragment>
      <div className="place-self-end p-2">
        <ModeToggle />
      </div>
      {children}
    </Fragment>
  );
}
