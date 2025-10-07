"use client";
import { useToaster } from "@/app/zustand/toaster";
import { Alert, Snackbar } from "@mui/material";
export default function Toaster() {
  const { status, message, type, close } = useToaster();
  return (
    <Snackbar
      open={status}
      autoHideDuration={3000}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={type} sx={{ width: "100%" }} onClose={close} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
