import { writable } from "svelte/store";

interface AuthState {
    token: string | null;
    isLoading: boolean;
    error: string | null
}

const initialState: AuthState = {
    token: null,
    isLoading: false,
    error: null
}

const authStore = $state<AuthState>(
    initialState
)

function setAuthToken(token: string) {
    authStore.token = token;
    authStore.isLoading = false;
    authStore.error = null;
}

function setIsLoading(isLoading: boolean) {
    authStore.isLoading = isLoading;
}

function setError(errorMsg: string) {
    authStore.error = errorMsg;
    authStore.isLoading = false;
}

export default {
    store: authStore,
    setAuthToken,
    setIsLoading,
    setError
}