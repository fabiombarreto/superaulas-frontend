// src/components/dashboard/artifacts/create-artifact-modal.tsx
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
  onArtifactCreated: () => void; // Novo callback para notificar a página pai sobre a criação
}

const artifactTypes = ["script", "video", "slide", "transcript", "feedback"] as const; // Adicionado os tipos do seu backend
const artifactStatuses = ["draft", "in_review", "published", "archived"] as const; // Adicionado os status do seu backend
const reviewTypes = ["text", "url"] as const;

export function CreateArtifactModal({ open, onClose, onArtifactCreated }: CreateArtifactModalProps): React.JSX.Element {
  const [name, setName] = React.useState<string>(""); // Novo estado para o nome
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
      setName(""); // Reseta o nome ao fechar
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
    setError(null); // Limpa erros anteriores

    if (!name.trim()) { // Validação para o campo nome
      setError("O nome do artefato é obrigatório.");
      return;
    }
    if (!file) {
      setError("Selecione um arquivo para enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name); // <<< ADICIONADO O CAMPO NAME
    formData.append("file", file);
    formData.append("type", type);
    formData.append("status", status);
    formData.append("review_type", reviewType);
    if (review) {
      formData.append("review", review);
    }

    try {
      setLoading(true);
      // O endpoint para upload de artefatos geralmente é diferente do endpoint geral de listar
      // Verifique no seu backend se é "/artifacts/upload" ou apenas "/artifacts" para POST
      await api.post("/artifacts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withAuth: true,
      } as ApiRequestConfig);
      setSuccess("Artefato criado com sucesso!");
      onClose(); // Fecha o modal
      onArtifactCreated(); // Notifica o componente pai para recarregar a lista
    } catch (error_) {
      console.error(error_);
      setError(error_ instanceof Error ? error_.message : "Erro ao criar artefato");
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
            {/* NOVO CAMPO PARA O NOME */}
            <TextField
              label="Nome do Artefato"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required // Marca como obrigatório
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
