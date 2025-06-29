'use client';

import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';

export function AuthProvider({ children }) {
    const initializeAuth = useAuthStore(state => state.initializeAuth);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
}