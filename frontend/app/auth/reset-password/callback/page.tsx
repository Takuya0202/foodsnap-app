"use client";

import { useToaster } from "@/app/zustand/toaster";

export default function ResetPasswordCallback() {
  const { open } = useToaster();
  
  return (
    <div>
      <h1>パスワードリセット</h1>
    </div>
  );
}