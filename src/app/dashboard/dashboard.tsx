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
// dayjs não é mais estritamente necessário se não houver dados mockados com datas,
// mas pode ser útil para formatação de datas de artefatos reais se a API retornar
// e você quiser exibi-las. Vou manter por precaução.
import dayjs from "dayjs";

import type { Artifact } from "@/types/artifact";
import { ArtifactCard } from "@/components/dashboard/artifacts/artifact-card";
import { CreateArtifactModal } from "@/components/artifacts/create-artifact-modal";
import { EditArtifactModal } from "@/components/artifacts/edit-artifact-modal";
import { DeleteArtifactConfirmModal } from "@/components/artifacts/delete-artifact-modal"; 

// Importação do apiFetch (certifique-se de que este caminho está correto)
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
                minHeight: '80px',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'action.hover',
                }
            }}
            onClick={onClick}
        >
            <Typography color="text.secondary" variant="body2">
                + Adicionar Tarefa
            </Typography>
        </Box>
    );
}

// Dados mockados removidos

export default function Dashboard(): React.JSX.Element {
    // Inicializa artifacts como array vazio e loading como true para carregar do backend
    const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const [openCreateModal, setOpenCreateModal] = React.useState<boolean>(false);
    const [selectedArtifact, setSelectedArtifact] = React.useState<Artifact | null>(null); // Para o modal de edição

    // Estados para o modal de exclusão
    const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = React.useState<boolean>(false);
    const [artifactToDelete, setArtifactToDelete] = React.useState<Artifact | null>(null); // Artefato a ser excluído
    const [deletingArtifact, setDeletingArtifact] = React.useState<boolean>(false);
    const [deleteArtifactError, setDeleteArtifactError] = React.useState<string | null>(null);


    // Busca os artefatos do backend
    const fetchArtifacts = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
       
       
            const response = await apiFetch("/artifacts")

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro ao buscar artefatos: ${response.statusText}`);
            }

            const data = await response.json();
            setArtifacts(data.items || data); // Assumindo que a API retorna { items: [...] } ou [...]
        } catch (error_) {
            console.error("Erro ao buscar artefatos:", error_);
            setError(error_ instanceof Error ? error_.message : "Erro desconhecido ao buscar artefatos.");
            setArtifacts([]); // Limpa artefatos em caso de erro na API
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchArtifacts();
    }, [fetchArtifacts]);

    // Funções para Modais
    const handleOpenCreateModal = () => setOpenCreateModal(true);
    const handleCloseCreateModal = () => setOpenCreateModal(false);

    const handleArtifactCreated = () => {
        handleCloseCreateModal();
        fetchArtifacts(); // Recarrega a lista de artefatos após a criação
    };

    const handleOpenEditModal = (artifact: Artifact) => {
        setSelectedArtifact(artifact);
    };
    const handleCloseEditModal = () => {
        setSelectedArtifact(null);
    };

    const handleArtifactUpdated = (updatedArtifact: Artifact) => {
        setArtifacts((prev) =>
            prev.map((a) => (a.id === updatedArtifact.id ? updatedArtifact : a))
        );
        handleCloseEditModal();
    };

    // --- Funções para Exclusão ---
    const handleOpenDeleteConfirmModal = React.useCallback((artifact: Artifact) => {
        setArtifactToDelete(artifact);
        setOpenDeleteConfirmModal(true);
        setDeleteArtifactError(null);
    }, []);

    const handleCloseDeleteConfirmModal = React.useCallback(() => {
        setOpenDeleteConfirmModal(false);
        setArtifactToDelete(null);
        setDeleteArtifactError(null);
    }, []);

    const handleConfirmDeleteArtifact = React.useCallback(async (artifactId: string) => {
        setDeletingArtifact(true);
        setDeleteArtifactError(null);
        try {
            const response = await apiFetch(`/artifacts/${artifactId}`, {
        method: 'DELETE',
      });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Erro ao excluir artefato: ${response.statusText}`);
            }

            handleCloseDeleteConfirmModal();
            fetchArtifacts(); // Recarrega a lista para remover o artefato excluído
        } catch (err) {
            console.error("Erro ao excluir artefato:", err);
            setDeleteArtifactError(err instanceof Error ? err.message : "Erro desconhecido ao excluir artefato.");
        } finally {
            setDeletingArtifact(false);
        }
    }, [fetchArtifacts, handleCloseDeleteConfirmModal]);


    const draft = artifacts.filter((a) => a.status === "draft");
    const inReview = artifacts.filter((a) => a.status === "in_review");
    const published = artifacts.filter((a) => a.status === "published");
    // const archived = artifacts.filter((a) => a.status === "archived"); // Removido


    return (
        <Stack spacing={3} sx={{ p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <AppBar position="static" color="inherit" elevation={1} sx={{ borderRadius: 1, mb: 3 }}>
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
                <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto', pb: 2 }}>
                    {/* Coluna Rascunho */}
                    <Grid size={{
                            xs: 12,
                            md: 4,
                            sm: 6,
                            lg: 3
                        }} sx={{ minWidth: '280px', maxWidth: '320px' }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: '#e0e0e0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Rascunho ({draft.length})</Typography>
                                <Button size="small" sx={{ minWidth: 'unset', p: '4px', borderRadius: '50%' }}>...</Button>
                            </Box>
                            {draft.map((artifact) => (
                                <ArtifactCard
                                    key={artifact.id}
                                    artifact={artifact}
                                    onClick={handleOpenEditModal}
                                    onDelete={handleOpenDeleteConfirmModal}
                                />
                            ))}
                            <CardPlaceholder onClick={handleOpenCreateModal} />
                        </Stack>
                    </Grid>

                    {/* Coluna Em Revisão */}
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
                                    onClick={handleOpenEditModal}
                                    onDelete={handleOpenDeleteConfirmModal}
                                />
                            ))}
                            <CardPlaceholder onClick={handleOpenCreateModal} />
                        </Stack>
                    </Grid>

                    {/* Coluna Publicado */}
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
                                    onClick={handleOpenEditModal}
                                    onDelete={handleOpenDeleteConfirmModal}
                                />
                            ))}
                            <CardPlaceholder onClick={handleOpenCreateModal} />
                        </Stack>
                    </Grid>

                    {/* Coluna Arquivado REMOVIDA */}
                </Grid>
            )}

            {/* Modal de Criação de Artefato */}
            <CreateArtifactModal
                open={openCreateModal}
                onClose={handleCloseCreateModal}
                onArtifactCreated={fetchArtifacts} // Corrigido para chamar fetchArtifacts
            />

            {/* Modal de Edição de Artefato */}
            <EditArtifactModal
                open={Boolean(selectedArtifact)}
                artifact={selectedArtifact}
                onClose={handleCloseEditModal}
                onSaved={handleArtifactUpdated}
            />

            {/* Modal de Confirmação de Exclusão de Artefato */}
            <DeleteArtifactConfirmModal
                open={openDeleteConfirmModal}
                onClose={handleCloseDeleteConfirmModal}
                artifact={artifactToDelete}
                onConfirmDelete={handleConfirmDeleteArtifact}
                loading={deletingArtifact}
                error={deleteArtifactError}
            />
        </Stack>
    );
}
