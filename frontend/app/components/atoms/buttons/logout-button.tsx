"use client";
import { useToaster } from "@/app/zustand/toaster";
import { client } from "@/utils/setting";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Logout } from "@mui/icons-material";

export default function LogoutButton() {
  const router = useRouter();
  const { open } = useToaster();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsSubmitting(true);
    const res = await client.api.auth.logout.$post();
    if (res.status === 200) {
      open("ログアウトしました。", "success");
      router.push("/user/login");
    } else {
      open("ログアウトに失敗しました。", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={isSubmitting ? <CircularProgress size={16} /> : <Logout />}
      onClick={handleLogout}
      disabled={isSubmitting}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 500,
        p: 1.5,
        borderWidth: 1,
        "&:hover": {
          borderWidth: 2,
          backgroundColor: "error.light",
          color: "white",
        },
        "&:disabled": {
          borderWidth: 2,
          opacity: 0.7,
        },
      }}
    >
      {isSubmitting ? "ログアウト中..." : "ログアウト"}
    </Button>
  );
}
