import { useRef, useState } from "react";
import {
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import api from "../services/api";

function FileUpload({ onUploadSuccess }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showSnack = (severity, message) => {
    setSnack({
      open: true,
      severity,
      message,
    });
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const validateFile = (file) => {
    if (!file) return "Please select a file.";

    const allowedExt = ["csv", "xls", "xlsx"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExt.includes(ext)) {
      return "Only CSV, XLS, and XLSX files are allowed.";
    }

    if (file.size > 10 * 1024 * 1024) {
      return "File size must be under 10 MB.";
    }

    return "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const validationError = validateFile(file);

    if (validationError) {
      showSnack("error", validationError);
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSnack(
        "success",
        response.data?.message || "File uploaded successfully.",
      );
      onUploadSuccess?.();
    } catch (error) {
      showSnack(
        "error",
        error?.response?.data?.message ||
          "File upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          component="label"
          startIcon={
            uploading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <CloudUploadOutlinedIcon />
            )
          }
          disabled={uploading}
          sx={{ minWidth: 170, height: 40 }}
        >
          {uploading ? "Uploading..." : "Upload Excel/CSV"}
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />
        </Button>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FileUpload;
