import { Alert, Snackbar } from "@mui/material";

type props = {
  text: string;
  open: boolean;
  onClose: () => void;
};

export default function ErrorToaster({ text, open, onClose }: props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error" sx={{ width: "100%" }} onClose={onClose} variant="filled">
        {text}
      </Alert>
    </Snackbar>
  );
}
