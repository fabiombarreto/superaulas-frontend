import { logout } from "@/lib/auth/logout";

// Base URL for the API. Allows overriding via environment variable.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export interface ApiOptions extends RequestInit {
	auth?: boolean;
}

/**
 * Wrapper around fetch that automatically adds the JWT token if available.
 */
export async function apiFetch(path: string, options: ApiOptions = {}): Promise<Response> {
	const { auth = true, headers, ...rest } = options;
	const initHeaders = new Headers(headers);

	if (auth) {
		const token = localStorage.getItem("token");
		if (token) {
			initHeaders.set("Authorization", `Bearer ${token}`);
		}
	}

	const res = await fetch(`${API_BASE}${path}`, { ...rest, headers: initHeaders });

        if (res.status === 401) {
                logout();
        }

	return res;
}
