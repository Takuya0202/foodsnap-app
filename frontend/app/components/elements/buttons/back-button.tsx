"use client";

import { useRouter } from "next/navigation";
import React from "react";
type props = {
  children: React.ReactNode;
  className?: string;
};
export default function BackButton({ children, className }: props) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
