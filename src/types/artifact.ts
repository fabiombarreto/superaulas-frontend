export interface ArtifactUser {
	id: string;
	name?: string;
	avatar?: string;
}

export interface Artifact {
	id: string;
	name: string;
	type: string;
	status: "draft" | "in_review" | "published";
	review_type: string;
	link?: string;
	review?: string;
	created_at: string;
	updated_at: string;
	created_by: ArtifactUser;
	updated_by: ArtifactUser;
}
