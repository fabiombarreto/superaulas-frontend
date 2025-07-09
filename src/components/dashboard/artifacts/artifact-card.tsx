// src/components/dashboard/artifacts/artifact-card.tsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box"; // Importado para usar Box para tags e ícones
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
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash"; // Importa o ícone de lixeira

const statusColorMap: Record<Artifact['status'], string> = {
    draft: '#FFD700',
    in_review: '#ADD8E6',
    published: '#90EE90',
    // Adicione mais status se existirem e você quiser cores específicas
};

import type { Artifact } from "@/types/artifact";

export interface ArtifactCardProps {
    artifact: Artifact;
    onClick?: (artifact: Artifact) => void;
    onDelete?: (artifact: Artifact) => void; // NOVO: Callback para exclusão
}


export function ArtifactCard({ artifact, onClick, onDelete }: ArtifactCardProps): React.JSX.Element {

    return (
        <Card
            onClick={() => onClick?.(artifact)}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "auto",
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                p: 1.5,
                backgroundColor: '#ffffff',
                cursor: onClick ? 'pointer' : 'default', // Cursor pointer apenas se onClick estiver presente
                '&:hover': {
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)', // Sombra mais forte no hover
                }
            }}
        >
            <CardContent sx={{ flex: "1 1 auto", p: 0, '&:last-child': { pb: 0 } }}>
                <Stack spacing={1}>
                    {/* ID e Título */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            {artifact.id}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                            {artifact.name}
                        </Typography>
                    </Stack>

                    {/* Tags (Status e Tipo) */}
                    <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                        <Chip
                            label={artifact.status.replace('_', ' ').toUpperCase()}
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
                                backgroundColor: '#f0f0f0',
                                color: 'text.secondary',
                                height: '20px',
                            }}
                        />
                    </Stack>

                    {/* Ícones e Avatares na parte inferior */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton size="small" sx={{ p: 0.5 }}>
                                <ListIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
                            </IconButton>
                            <IconButton size="small" sx={{ p: 0.5 }}>
                                <CalendarIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
                            </IconButton>
                            <IconButton size="small" sx={{ p: 0.5 }}>
                                <FlagIcon fontSize="var(--icon-fontSize-sm)" color="error.main" />
                            </IconButton>
                            <IconButton size="small" sx={{ p: 0.5 }}>
                                <ChatCircleIcon fontSize="var(--icon-fontSize-sm)" color="action.active" />
                                <Typography variant="caption" sx={{ ml: 0.5 }}>2</Typography>
                            </IconButton>
                            {/* NOVO: Botão de Excluir */}
                            {onDelete && ( // Renderiza o botão apenas se onDelete for fornecido
                                <IconButton
                                    size="small"
                                    sx={{ p: 0.5, ml: 'auto' }} // ml: 'auto' para empurrar para a direita
                                    onClick={(e) => {
                                        e.stopPropagation(); // IMPEDE que o clique no botão ative o onClick do Card
                                        onDelete(artifact);
                                    }}
                                >
                                    <TrashIcon fontSize="var(--icon-fontSize-sm)" color="error.main" />
                                </IconButton>
                            )}
                        </Stack>
                        <AvatarGroup sx={{ justifyContent: "flex-end" }}>
                            <Avatar src={artifact.created_by?.avatar} alt={artifact.created_by?.name} sx={{ width: 24, height: 24, fontSize: '0.75rem' }} />
                        </AvatarGroup>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
