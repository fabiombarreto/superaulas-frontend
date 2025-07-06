// src/components/dashboard/artifacts/artifact-card.tsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip"; // Para as tags de status/tipo
import IconButton from "@mui/material/IconButton"; // Para ícones de ação
import Stack from "@mui/material/Stack"; // Para layout flexível
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List"; // Ícone de lista
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr/Calendar"; // Ícone de calendário
import { Flag as FlagIcon } from "@phosphor-icons/react/dist/ssr/Flag"; // Ícone de flag (prioridade)
import { ChatCircle as ChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle"; // Ícone de chat

const statusColorMap: Record<Artifact['status'], string> = {
        draft: '#FFD700',
        in_review: '#ADD8E6',
        published: '#90EE90',
};

import type { Artifact } from "@/types/artifact";

export interface ArtifactCardProps {
        artifact: Artifact;
        onClick?: (artifact: Artifact) => void;
}


export function ArtifactCard({ artifact, onClick }: ArtifactCardProps): React.JSX.Element {

        return (
                <Card onClick={() => onClick?.(artifact)} sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "auto", // Altura automática para se ajustar ao conteúdo
                        borderRadius: 1, // Cantos mais arredondados
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Sombra sutil
                        border: '1px solid #e0e0e0', // Borda sutil
                        p: 1.5, // Padding interno
                        backgroundColor: '#ffffff', // Fundo branco
                        cursor: onClick ? 'pointer' : 'default',
                }}>
			<CardContent sx={{ flex: "1 1 auto", p: 0, '&:last-child': { pb: 0 } }}> {/* Remover padding padrão do CardContent */}
				<Stack spacing={1}>
					{/* ID e Título */}
					<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
						{artifact.id}
					</Typography>
					<Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
						{artifact.name}
					</Typography>

					{/* Tags (Status e Tipo) */}
					<Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
						<Chip
							label={artifact.status.replace('_', ' ').toUpperCase()} // Ex: DRAFT -> DRAFT
							size="small"
							sx={{
                                                                backgroundColor: statusColorMap[artifact.status] ?? '#D3D3D3',
								color: 'rgba(0,0,0,0.87)',
								fontWeight: 'bold',
								height: '20px',
							}}
						/>
						<Chip
							label={artifact.type.toUpperCase()}
							size="small"
							sx={{
								backgroundColor: '#f0f0f0', // Cor neutra para tipo
								color: 'text.secondary',
								height: '20px',
							}}
						/>
					</Stack>

					{/* Ícones e Avatares na parte inferior */}
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
						<Stack direction="row" spacing={1} alignItems="center">
							{/* Ícones de ação/informação (ex: lista, calendário, prioridade) */}
							<IconButton size="small" sx={{ p: 0.5 }}>
								<ListIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
							</IconButton>
							<IconButton size="small" sx={{ p: 0.5 }}>
								<CalendarIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
							</IconButton>
							{/* Exemplo de prioridade (você pode mapear para um campo real) */}
							<IconButton size="small" sx={{ p: 0.5 }}>
								<FlagIcon fontSize="var(--icon-fontSize-sm)" color="error.main" />
							</IconButton>
							{/* Exemplo de comentários */}
							<IconButton size="small" sx={{ p: 0.5 }}>
								<ChatCircleIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
								<Typography variant="caption" sx={{ ml: 0.5 }}>2</Typography> {/* Número de comentários mockado */}
							</IconButton>
						</Stack>
						<AvatarGroup sx={{ justifyContent: "flex-end" }}> {/* Avatares à direita */}
							<Avatar src={artifact.created_by?.avatar} alt={artifact.created_by?.name} sx={{ width: 24, height: 24, fontSize: '0.75rem' }} />
							{/* Removido updated_by para um visual mais limpo, como no ClickUp,
							    mas você pode adicionar de volta se for importante */}
							{/* <Avatar src={artifact.updated_by.avatar} alt={artifact.updated_by.name} sx={{ width: 24, height: 24, fontSize: '0.75rem' }} /> */}
						</AvatarGroup>
					</Stack>
				</Stack>
			</CardContent>
			{/* Removido CardActions para um visual mais limpo e compacto */}
			{/* <CardActions>
				<Button size="small">Details</Button>
				<Button size="small">Edit</Button>
			</CardActions> */}
		</Card>
	);
}
