"use client";
import StoreProvider from "./providers";
import { ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}