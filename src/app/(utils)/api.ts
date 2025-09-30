import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-eaf53379`;

class ApiClient {
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${BASE_URL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
        };

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async login(phone: string, password: string) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        });
    }

    async verifyPin(phone: string, pin: string) {
        return this.request('/auth/verify-pin', {
            method: 'POST',
            body: JSON.stringify({ phone, pin }),
        });
    }

    async collectReward(phone: string) {
        return this.request('/rewards/collect', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });
    }

    async getUserStats(phone: string) {
        return this.request(`/user/stats/${encodeURIComponent(phone)}`);
    }

    async getAllUsers() {
        return this.request('/admin/users');
    }

    async deleteUser(userId: string) {
        return this.request(`/admin/users/${encodeURIComponent(userId)}`, {
            method: 'DELETE',
        });
    }

    async healthCheck() {
        return this.request('/health');
    }
}

export const apiClient = new ApiClient();