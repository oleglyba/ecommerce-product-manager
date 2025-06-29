import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME;

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            error: null,

            login: async (credentials) => {
                set({ loading: true, error: null });

                try {
                    // Check for custom credentials first
                    if (credentials.username === 'user' && credentials.password === 'user') {
                        const mockUserData = {
                            id: 999,
                            username: 'user',
                            email: 'user@example.com',
                            firstName: 'User',
                            lastName: 'Demo',
                            role: 'user',
                            token: 'mock-user-token-' + Date.now()
                        };

                        Cookies.set(TOKEN_COOKIE_NAME, mockUserData.token, { expires: 7 });

                        set({
                            user: mockUserData,
                            token: mockUserData.token,
                            isAuthenticated: true,
                            isAdmin: false,
                            loading: false,
                            error: null
                        });

                        return mockUserData;
                    }

                    if (credentials.username === 'admin' && credentials.password === 'admin') {
                        // Mock admin login
                        const mockAdminData = {
                            id: 998,
                            username: 'admin',
                            email: 'admin@example.com',
                            firstName: 'Admin',
                            lastName: 'Demo',
                            role: 'admin',
                            token: 'mock-admin-token-' + Date.now()
                        };

                        Cookies.set(TOKEN_COOKIE_NAME, mockAdminData.token, { expires: 7 });

                        set({
                            user: mockAdminData,
                            token: mockAdminData.token,
                            isAuthenticated: true,
                            isAdmin: true, // Admin user
                            loading: false,
                            error: null
                        });

                        return mockAdminData;
                    }

                    // Fall back to DummyJSON API
                    const response = await fetch(`${API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials)
                    });

                    if (!response.ok) {
                        throw new Error('Invalid credentials');
                    }

                    const data = await response.json();

                    // Store token in cookie
                    Cookies.set(TOKEN_COOKIE_NAME, data.token || data.accessToken, { expires: 7 });

                    set({
                        user: { ...data, role: 'api-user' },
                        token: data.token || data.accessToken,
                        isAuthenticated: true,
                        isAdmin: false,
                        loading: false,
                        error: null
                    });

                    return data;
                } catch (error) {
                    set({
                        loading: false,
                        error: error.message || 'Login failed'
                    });
                    throw error;
                }
            },

            logout: () => {
                Cookies.remove(TOKEN_COOKIE_NAME);
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    error: null
                });
            },

            initializeAuth: () => {
                const token = Cookies.get(TOKEN_COOKIE_NAME);
                if (token) {
                    if (token.startsWith('mock-user-token')) {
                        set({
                            user: {
                                id: 999,
                                username: 'user',
                                email: 'user@example.com',
                                firstName: 'User',
                                lastName: 'Demo',
                                role: 'user'
                            },
                            token,
                            isAuthenticated: true,
                            isAdmin: false
                        });
                    } else if (token.startsWith('mock-admin-token')) {
                        set({
                            user: {
                                id: 998,
                                username: 'admin',
                                email: 'admin@example.com',
                                firstName: 'Admin',
                                lastName: 'Demo',
                                role: 'admin'
                            },
                            token,
                            isAuthenticated: true,
                            isAdmin: true
                        });
                    } else {
                        set({
                            token,
                            isAuthenticated: true,
                            isAdmin: false
                        });
                    }
                }
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                isAdmin: state.isAdmin
            })
        }
    )
);

export default useAuthStore;