import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { paths } from "@/paths";

/**
 * Custom Axios request configuration allowing a boolean `withAuth` property
 * to indicate if the request should include the JWT token.
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
	/** Whether to attach the Authorization header */
	withAuth?: boolean;
}

/**
 * Axios instance pre-configured with the API base URL.
 */
const api: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
});

// Add a request interceptor to inject the JWT token when required.
api.interceptors.request.use((config) => {
	const withAuth = (config as ApiRequestConfig).withAuth;

	if (withAuth) {
		const token = localStorage.getItem("token");

		if (token) {
			config.headers = config.headers ?? {};
			(config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

// Add a response interceptor to handle unauthorized responses.
api.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");

			if (globalThis.window !== undefined) {
				globalThis.location.href = paths.auth.signIn;
			}
		}

		return Promise.reject(error);
	}
);

export default api;
