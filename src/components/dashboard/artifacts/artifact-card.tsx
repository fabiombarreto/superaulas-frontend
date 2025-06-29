import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Artifact } from "@/types/artifact";

export interface ArtifactCardProps {
	artifact: Artifact;
}

export function ArtifactCard({ artifact }: ArtifactCardProps): React.JSX.Element {
	return (
		<Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			{artifact.link ? <CardMedia component="img" height="140" image={artifact.link} alt={artifact.name} /> : null}
			<CardContent sx={{ flex: "1 1 auto" }}>
				<Stack spacing={1}>
					<Typography variant="subtitle1">{artifact.name}</Typography>
					<Typography color="text.secondary" variant="body2">
						{artifact.type}
					</Typography>
					<AvatarGroup sx={{ justifyContent: "flex-start" }}>
						<Avatar src={artifact.created_by.avatar} alt={artifact.created_by.name} />
						<Avatar src={artifact.updated_by.avatar} alt={artifact.updated_by.name} />
					</AvatarGroup>
				</Stack>
			</CardContent>
			<CardActions>
				<Button size="small">Details</Button>
				<Button size="small">Edit</Button>
			</CardActions>
		</Card>
	);
}
