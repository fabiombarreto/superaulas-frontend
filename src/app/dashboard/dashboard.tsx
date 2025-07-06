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
import dayjs from "dayjs"; // Para ajudar com as datas

import type { Artifact } from "@/types/artifact"; // Sua interface Artifact
import { ArtifactCard } from "@/components/dashboard/artifacts/artifact-card"; // Seu componente ArtifactCard

// Componente Placeholder para adicionar artefatos
function CardPlaceholder(): React.JSX.Element {
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
		>
			<Typography color="text.secondary" variant="body2">
				+ Adicionar Artefato
			</Typography>
		</Box>
	);
}

// Dados mockados para os artefatos
const mockedArtifacts: Artifact[] = [
  {
    id: "ART-001",
    name: "Introdução ao FastAPI",
    type: "script",
    status: "draft",
    review_type: "text",
    review: "Rascunho inicial, precisa de revisão de conteúdo.",
    link: "https://placehold.co/140x140/FF5733/FFFFFF?text=Script+FastAPI",
    created_at: dayjs().subtract(5, "days").toISOString(),
    updated_at: dayjs().subtract(1, "days").toISOString(),
    created_by: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
    updated_by: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
  },
  {
    id: "ART-002",
    name: "Design de APIs REST",
    type: "slide",
    status: "draft",
    review_type: "url",
    review: undefined,
    link: "https://placehold.co/140x140/33FF57/FFFFFF?text=Slides+REST",
    created_at: dayjs().subtract(7, "days").toISOString(),
    updated_at: dayjs().subtract(2, "days").toISOString(),
    created_by: { id: "USR-002", name: "Siegbert Gottfried", avatar: "/assets/avatar-2.png" },
    updated_by: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
  },
  {
    id: "ART-003",
    name: "Tutorial de SQLAlchemy",
    type: "video",
    status: "in_review",
    review_type: "url",
    review: "Revisão pendente do time de conteúdo.",
    link: "https://placehold.co/140x140/3357FF/FFFFFF?text=Video+SQLA",
    created_at: dayjs().subtract(10, "days").toISOString(),
    updated_at: dayjs().subtract(3, "hours").toISOString(),
    created_by: { id: "USR-003", name: "Carson Darrin", avatar: "/assets/avatar-3.png" },
    updated_by: { id: "USR-003", name: "Carson Darrin", avatar: "/assets/avatar-3.png" },
  },
  {
    id: "ART-004",
    name: "Guia de Autenticação JWT",
    type: "script",
    status: "in_review",
    review_type: "text",
    review: "Aguardando feedback do revisor técnico.",
    link: "https://placehold.co/140x140/FF33A8/FFFFFF?text=Script+JWT",
    created_at: dayjs().subtract(12, "days").toISOString(),
    updated_at: dayjs().subtract(1, "hour").toISOString(),
    created_by: { id: "USR-004", name: "Penjani Inyene", avatar: "/assets/avatar-4.png" },
    updated_by: { id: "USR-002", name: "Siegbert Gottfried", avatar: "/assets/avatar-2.png" },
  },
  {
    id: "ART-005",
    name: "Melhores Práticas de Deploy",
    type: "video",
    status: "published",
    review_type: "url",
    review: "Publicado em 2024-06-15.",
    link: "https://placehold.co/140x140/33FFB5/FFFFFF?text=Video+Deploy",
    created_at: dayjs().subtract(15, "days").toISOString(),
    updated_at: dayjs().subtract(10, "days").toISOString(),
    created_by: { id: "USR-005", name: "Fran Perez", avatar: "/assets/avatar-5.png" },
    updated_by: { id: "USR-005", name: "Fran Perez", avatar: "/assets/avatar-5.png" },
  },
  {
    id: "ART-006",
    name: "Fundamentos de Bancos de Dados",
    type: "slide",
    status: "published",
    review_type: "text",
    review: "Disponível para todos os alunos.",
    link: "https://placehold.co/140x140/FF8C33/FFFFFF?text=Slides+DB",
    created_at: dayjs().subtract(20, "days").toISOString(),
    updated_at: dayjs().subtract(15, "days").toISOString(),
    created_by: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
    updated_by: { id: "USR-001", name: "Miron Vitold", avatar: "/assets/avatar-1.png" },
  },
];


export default function Dashboard(): React.JSX.Element {
  const artifacts = mockedArtifacts;
  const loading = false;
  const error = null;

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
								<ArtifactCard key={artifact.id} artifact={artifact} />
							))}
							<CardPlaceholder />
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
								<ArtifactCard key={artifact.id} artifact={artifact} />
							))}
							<CardPlaceholder />
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
								<ArtifactCard key={artifact.id} artifact={artifact} />
							))}
							<CardPlaceholder />
						</Stack>
					</Grid>
				</Grid>
			)}
		</Stack>
	);
}
