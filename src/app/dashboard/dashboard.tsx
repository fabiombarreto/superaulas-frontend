"use client";

import * as React from "react";
import api, { ApiRequestConfig } from "@/utils/api";
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

import type { Artifact } from "@/types/artifact";
import { ArtifactCard } from "@/components/dashboard/artifacts/artifact-card";

export default function Dashboard(): React.JSX.Element {
	const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		async function fetchArtifacts(): Promise<void> {
			try {
				// Example of an authenticated request using the custom API client.
				const response = await api.get<Artifact[]>("/artifacts", { withAuth: true } as ApiRequestConfig);
				setArtifacts(response.data as Artifact[]);
			} catch (error) {
				console.error(error);
				setError("Failed to load artifacts");
			} finally {
				setLoading(false);
			}
		}

		fetchArtifacts();
	}, []);

	const draft = artifacts.filter((a) => a.status === "draft");
	const inReview = artifacts.filter((a) => a.status === "in_review");
	const published = artifacts.filter((a) => a.status === "published");

	return (
		<Stack spacing={3}>
			<AppBar position="static" color="default" elevation={0}>
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						SuperAulas Dashboard
					</Typography>
					<TextField size="small" placeholder="Search" sx={{ mr: 2 }} variant="outlined" />
					<Button variant="contained">View Details</Button>
				</Toolbar>
			</AppBar>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
					<CircularProgress />
				</Box>
			) : error ? (
				<Alert severity="error">{error}</Alert>
			) : (
				<Grid container spacing={2}>
					<Grid
						size={{
							xs: 12,
							md: 4,
						}}
					>
						<Stack spacing={2}>
							<Typography variant="h6">Draft</Typography>
							{draft.map((artifact) => (
								<ArtifactCard key={artifact.id} artifact={artifact} />
							))}
							<CardPlaceholder />
						</Stack>
					</Grid>
					<Grid
						size={{
							xs: 12,
							md: 4,
						}}
					>
						<Stack spacing={2}>
							<Typography variant="h6">In Review</Typography>
							{inReview.map((artifact) => (
								<ArtifactCard key={artifact.id} artifact={artifact} />
							))}
							<CardPlaceholder />
						</Stack>
					</Grid>
					<Grid
						size={{
							xs: 12,
							md: 4,
						}}
					>
						<Stack spacing={2}>
							<Typography variant="h6">Published</Typography>
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
			}}
		>
			<Typography color="text.secondary" variant="body2">
				+ Add Artifact
			</Typography>
		</Box>
	);
}
