"use client";

import type { User } from "@/types/user";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth/logout";

const user = {
	id: "USR-000",
	avatar: "/assets/avatar.png",
	firstName: "Sofia",
	lastName: "Rivers",
	email: "sofia@devias.io",
} satisfies User;

export interface SignUpParams {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface SignInWithOAuthParams {
	provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
	email: string;
	password: string;
}

export interface ResetPasswordParams {
	email: string;
}

class AuthClient {
	async signUp(_: SignUpParams): Promise<{ error?: string }> {
		return { error: "Sign up not implemented" };
	}

	async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
		return { error: "Social authentication not implemented" };
	}

	async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
		try {
			const res = await apiFetch("/auth/login", {
				method: "POST",
				auth: false,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(params),
			});

			if (!res.ok) {
				return { error: "Invalid credentials" };
			}

			const data = (await res.json()) as { access_token?: string };

			if (!data.access_token) {
				return { error: "Invalid response from server" };
			}

			// Persist the JWT so future requests can be authenticated.
			localStorage.setItem("token", data.access_token);

			return {};
		} catch {
			return { error: "Network error" };
		}
	}

	async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
		return { error: "Password reset not implemented" };
	}

	async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
		return { error: "Update reset not implemented" };
	}

	async getUser(): Promise<{ data?: User | null; error?: string }> {
		// Make API request

		// We do not handle the API, so just check if we have a token in localStorage.
		const token = localStorage.getItem("token");

		if (!token) {
			return { data: null };
		}

		return { data: user };
	}

        async signOut(): Promise<{ error?: string }> {
                logout();

                return {};
        }
}

export const authClient = new AuthClient();
