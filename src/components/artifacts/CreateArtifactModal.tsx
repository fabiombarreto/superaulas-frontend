"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import api, { ApiRequestConfig } from "@/utils/api";

export interface CreateArtifactModalProps {
  open: boolean;
  onClose: () => void;
}

const artifactTypes = ["script", "video", "slide"] as const;
const artifactStatuses = ["draft", "in_review", "published"] as const;
const reviewTypes = ["text", "url"] as const;

export function CreateArtifactModal({ open, onClose }: CreateArtifactModalProps): React.JSX.Element {
  const [type, setType] = React.useState<typeof artifactTypes[number]>("script");
  const [status, setStatus] = React.useState<typeof artifactStatuses[number]>("draft");
  const [reviewType, setReviewType] = React.useState<typeof reviewTypes[number]>("text");
  const [review, setReview] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setType("script");
      setStatus("draft");
      setReviewType("text");
      setReview("");
      setFile(null);
      setSuccess(null);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("status", status);
    formData.append("review_type", reviewType);
    if (review) {
      formData.append("review", review);
    }

    try {
      setLoading(true);
      await api.post("/artifacts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withAuth: true,
      } as ApiRequestConfig);
      setSuccess("Artefato criado com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro ao criar artefato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo Artefato</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select value={type} onChange={(e) => setType(e.target.value as typeof artifactTypes[number])} fullWidth>
              {artifactTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value as typeof artifactStatuses[number])} fullWidth>
              {artifactStatuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
            <Select value={reviewType} onChange={(e) => setReviewType(e.target.value as typeof reviewTypes[number])} fullWidth>
              {reviewTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Review"
              multiline
              minRows={2}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              fullWidth
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Enviando..." : "Criar artefato"}
          </Button>
        </DialogActions>
      </form>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        {success ? <Alert severity="success">{success}</Alert> : undefined}
      </Snackbar>
    </Dialog>
  );
}
