import type { TheShowAuthResponse } from '$lib/schemas/auth';
import { AuthenticateWithXbox } from '$lib/services/auth';
import { createContext } from 'svelte';

type AuthManagerState = {
	username: string | null;
	accountId: number | null;
	accountToken: string | null;
	expires: string | null;
};

const LOCAL_STORAGE_KEY = 'authManager';

class AuthManager {
	#username = $state<string | null>(null);
	#accountId = $state<number | null>(null);
	#token = $state<string | null>(null);
	#expires = $state<string | null>(null);

	#isLoading = $state(false);
	#error = $state<string | null>(null);

	constructor() {
		// Optional: Try to load existing token from local storage on instantiation
		// This allows users to stay logged in across app restarts
		if (typeof window !== 'undefined') {
			// Check if in browser environment
			this.loadFromLocalStorage();
		}
	}

	get accountId() {
		return this.#accountId;
	}
	get username() {
		return this.#username;
	}
	get token() {
		return this.#token;
	}
	get isLoading() {
		return this.#isLoading;
	}
	get error() {
		return this.#error;
	}

	// A derived state to easily check if the user is authenticated
	get isAuthenticated() {
		return this.#token !== null;
	}

	async authenticate(authCode: string) {
		if (this.#isLoading || this.isAuthenticated) {
			console.warn('Auth already in progress or already authenticated. Skipping.');
			return; // Prevent re-authentication if already authenticated or loading
		}

		this.clearAuth();
		this.#isLoading = true;

		try {
			const authResponse = await AuthenticateWithXbox(authCode);

			this.handleAuthResponse(authResponse);
		} catch (error: any) {
			console.error('deepLinkAuth error:', error);
			this.#error = error.message || 'An unexpected error occurred';
			throw error; // Re-throw to allow component to handle if necessary
		} finally {
			this.#isLoading = false;
		}
	}

	private handleAuthResponse(response: TheShowAuthResponse) {
		this.#accountId = response.account_id;
		this.#token = response.account_token;
		this.#username = response.username;
		this.#expires = response.expiration;

		this.#error = null;
		this.#isLoading = false;

		this.saveToLocalStorage();
	}

	private loadFromLocalStorage() {
		const storedInfo = localStorage.getItem(LOCAL_STORAGE_KEY);

		if (!storedInfo) return;

		const data = JSON.parse(storedInfo) as AuthManagerState;

		this.#accountId = data.accountId;
		this.#expires = data.expires;
		this.#token = data.accountToken;
		this.#username = data.username;

		return data;
	}

	private saveToLocalStorage() {
		localStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify({
				accountId: this.#accountId,
				accountToken: this.#token,
				username: this.#username,
				expires: this.#expires
			} satisfies AuthManagerState)
		);
	}

	clearAuth() {
		this.#token = null;
		this.#isLoading = false;
		this.#error = null;

		if (typeof window !== 'undefined') {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			console.log('Authentication cleared.');
		}
	}
}

const [internalGetAuthStore, internalSetAuthStore] = createContext<AuthManager>();
const getAuthStore = () => {
	const authStore = internalGetAuthStore();
	if (!authStore) throw new Error('AuthStore not found');
	return authStore;
};

const setAuthStore = () => {
	const authStore = new AuthManager();
	return internalSetAuthStore(authStore);
};

export { getAuthStore, setAuthStore };
