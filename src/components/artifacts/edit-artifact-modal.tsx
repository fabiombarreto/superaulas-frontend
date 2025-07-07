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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import type { Artifact } from "@/types/artifact";
import api, { ApiRequestConfig } from "@/utils/api";

export interface EditArtifactModalProps {
  artifact: Artifact | null;
  open: boolean;
  onClose: () => void;
  onSaved?: (artifact: Artifact) => void;
}

const artifactTypes = ["script", "video", "slide"] as const;
const artifactStatuses = ["draft", "in_review", "published"] as const;
const reviewTypes = ["text", "url"] as const;

export function EditArtifactModal({
  artifact,
  open,
  onClose,
  onSaved,
}: EditArtifactModalProps): React.JSX.Element {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<typeof artifactTypes[number]>("script");
  const [status, setStatus] = React.useState<typeof artifactStatuses[number]>("draft");
  const [reviewType, setReviewType] = React.useState<typeof reviewTypes[number]>("text");
  const [review, setReview] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [reviewLoading, setReviewLoading] = React.useState(false);
  const [reviewSuccess, setReviewSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (artifact && open) {
      setName(artifact.name ?? "");
      setType(artifact.type as typeof artifactTypes[number]);
      setStatus(artifact.status as typeof artifactStatuses[number]);
      setReviewType(artifact.review_type as typeof reviewTypes[number]);
      setReview(artifact.review ?? "");
      setLink(artifact.link ?? "");
      setError(null);
    }
  }, [artifact, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!artifact) return;
    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.put(`/artifacts/${artifact.id}`, {
        name,
        type,
        status,
        review_type: reviewType,
        review,
        link,
      }, { withAuth: true } as ApiRequestConfig);
      if (onSaved) {
        onSaved(data as Artifact);
      }
      onClose();
    } catch (error_) {
      console.error(error_);
      setError(error_ instanceof Error ? error_.message : "Erro ao atualizar artefato");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerReview = async () => {
    if (!artifact) return;
    try {
      setReviewLoading(true);
      setError(null);
      const { data } = await api.post(
        `/artifacts/${artifact.id}/review`,
        {},
        { withAuth: true } as ApiRequestConfig
      );
      const updated = data as Artifact;
      setReview(updated.review ?? "");
      setStatus(updated.status as typeof artifactStatuses[number]);
      if (onSaved) {
        onSaved(updated);
      }
      setReviewSuccess("Review atualizado com sucesso!");
    } catch (error_) {
      console.error(error_);
      setError(
        error_ instanceof Error ? error_.message : "Erro ao disparar review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Artefato</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
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
            <TextField
              label="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading || reviewLoading} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleTriggerReview}
            variant="outlined"
            disabled={reviewLoading || loading}
            startIcon={reviewLoading ? <CircularProgress size={18} /> : undefined}
          >
            Disparar Review
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : undefined}>
            Salvar
          </Button>
        </DialogActions>
      </form>
      <Snackbar
        open={Boolean(reviewSuccess)}
        autoHideDuration={6000}
        onClose={() => setReviewSuccess(null)}
      >
        {reviewSuccess ? <Alert severity="success">{reviewSuccess}</Alert> : undefined}
      </Snackbar>
    </Dialog>
  );
}
