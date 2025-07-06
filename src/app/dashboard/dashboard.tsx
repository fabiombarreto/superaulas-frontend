// src/app/dashboard/dashboard.tsx
"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import type { Artifact } from "@/types/artifact"; // Sua interface Artifact
import { ArtifactCard } from "@/components/dashboard/artifacts/artifact-card"; // Seu componente ArtifactCard
import { CreateArtifactModal } from "@/components/artifacts/create-artifact-modal";
import { EditArtifactModal } from "@/components/artifacts/edit-artifact-modal";
import { apiFetch } from "@/lib/api";

// Componente Placeholder para adicionar artefatos
interface CardPlaceholderProps {
        onClick: () => void;
}

function CardPlaceholder({ onClick }: CardPlaceholderProps): React.JSX.Element {
        return (
                <Box
                        sx={{
                                alignItems: "center",
				border: "1px dashed var(--mui-palette-divider)",
				borderRadius: 1,
				display: "flex",
				justifyContent: "center",
				p: 2,
				minHeight: '80px', // Altura mínima para o placeholder
				cursor: 'pointer',
                                '&:hover': {
                                        backgroundColor: 'action.hover',
                                }
                        }}
                        onClick={onClick}
                >
                        <Typography color="text.secondary" variant="body2">
                                + Adicionar Artefato
                        </Typography>
                </Box>
	);
}

// Component principal do Dashboard
export default function Dashboard(): React.JSX.Element {
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [openCreateModal, setOpenCreateModal] = React.useState<boolean>(false);
  const [selectedArtifact, setSelectedArtifact] = React.useState<Artifact | null>(null);

  // Busca os artefatos do backend
  const fetchArtifacts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/artifacts");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro ao buscar artefatos: ${response.statusText}`);
      }

      const data = await response.json();
      setArtifacts(data.items || data);
    } catch (error_) {
      console.error("Erro ao buscar artefatos:", error_);
      setError(error_ instanceof Error ? error_.message : "Erro desconhecido ao buscar artefatos.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

	const draft = artifacts.filter((a) => a.status === "draft");
	const inReview = artifacts.filter((a) => a.status === "in_review");
	const published = artifacts.filter((a) => a.status === "published");

	return (
		<Stack spacing={3} sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}> {/* Adicionado padding e cor de fundo */}
			<AppBar position="static" color="inherit" elevation={1} sx={{ borderRadius: 1, mb: 3 }}> {/* AppBar mais integrada */}
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
						SuperAulas Dashboard
					</Typography>
					<TextField size="small" placeholder="Buscar tarefas..." sx={{ mr: 2, minWidth: '200px' }} variant="outlined" />
					<Button variant="contained" sx={{ textTransform: 'none' }}>
						Ver Detalhes
					</Button>
				</Toolbar>
			</AppBar>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
					<CircularProgress />
				</Box>
			) : error ? (
				<Alert severity="error">{error}</Alert>
			) : (
				<Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}> {/* Adicionado wrap="nowrap" e overflowX */}
					<Grid size={{
							xs: 12,
							md: 4,
							sm: 6,
							lg: 3
						}} sx={{ minWidth: '280px', maxWidth: '320px' }}> {/* Largura fixa para colunas */}
						<Stack spacing={2}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: '#e0e0e0' }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Rascunho ({draft.length})</Typography>
								<Button size="small" sx={{ minWidth: 'unset', p: '4px', borderRadius: '50%' }}>...</Button> {/* Botão de opções */}
							</Box>
                                                        {draft.map((artifact) => (
                                                                <ArtifactCard
                                                                        key={artifact.id}
                                                                        artifact={artifact}
                                                                        onClick={() => setSelectedArtifact(artifact)}
                                                                />
                                                        ))}
                                                        <CardPlaceholder onClick={() => setOpenCreateModal(true)} />
						</Stack>
					</Grid>
					<Grid size={{
							xs: 12,
							md: 4,
							sm: 6,
							lg: 3
						}} sx={{ minWidth: '280px', maxWidth: '320px' }}>
						<Stack spacing={2}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: '#e0e0e0' }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Em Revisão ({inReview.length})</Typography>
								<Button size="small" sx={{ minWidth: 'unset', p: '4px', borderRadius: '50%' }}>...</Button>
							</Box>
                                                        {inReview.map((artifact) => (
                                                                <ArtifactCard
                                                                        key={artifact.id}
                                                                        artifact={artifact}
                                                                        onClick={() => setSelectedArtifact(artifact)}
                                                                />
                                                        ))}
                                                        <CardPlaceholder onClick={() => setOpenCreateModal(true)} />
						</Stack>
					</Grid>
					<Grid size={{
							xs: 12,
							md: 4,
							sm: 6,
							lg: 3
						}} sx={{ minWidth: '280px', maxWidth: '320px' }}>
						<Stack spacing={2}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: '#e0e0e0' }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Publicado ({published.length})</Typography>
								<Button size="small" sx={{ minWidth: 'unset', p: '4px', borderRadius: '50%' }}>...</Button>
							</Box>
                                                        {published.map((artifact) => (
                                                                <ArtifactCard
                                                                        key={artifact.id}
                                                                        artifact={artifact}
                                                                        onClick={() => setSelectedArtifact(artifact)}
                                                                />
                                                        ))}
                                                        <CardPlaceholder onClick={() => setOpenCreateModal(true)} />
						</Stack>
					</Grid>
                                </Grid>
                        )}
                        <CreateArtifactModal
                                open={openCreateModal}
                                onClose={() => setOpenCreateModal(false)}
                        />
                        <EditArtifactModal
                                open={Boolean(selectedArtifact)}
                                artifact={selectedArtifact}
                                onClose={() => setSelectedArtifact(null)}
                                onSaved={(updated) =>
                                        setArtifacts((prev) =>
                                                prev.map((a) => (a.id === updated.id ? updated : a))
                                        )
                                }
                        />
                </Stack>
        );
}
