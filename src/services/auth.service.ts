import apiClient from '../config/api.config';
import StorageService from './storage.service';

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        permissions?: string[];
    };
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
}

export const AuthService = {
    
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<LoginResponse>('/api/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });

            const { token, user } = response.data;

            const persistent = credentials.rememberMe || false;
            StorageService.setItem('authToken', token, persistent);
            StorageService.setItem('authUser', user, persistent);

            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
        try {
            const response = await apiClient.post('/api/auth/forgot-password', data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async resetPassword(token: string, data: ResetPasswordRequest): Promise<{ message: string }> {
        try {
            const response = await apiClient.post(`/api/auth/reset-password/${token}`, data);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    async getProfile(): Promise<{ success: boolean; user: any }> {
        const response = await apiClient.get('/api/auth/profile');
        return response.data;
    },

    logout(): void {
        StorageService.clearAuth();
    },

    getToken(): string | null {
        return StorageService.getItem('authToken');
    },

    getCurrentUser(): LoginResponse['user'] | null {
        return StorageService.getItem('authUser', true);
    },

    isAuthenticated(): boolean {
        return StorageService.isAuthenticated();
    },
};

export default AuthService;
