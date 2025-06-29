'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';
import styles from './login.module.scss';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showDemo, setShowDemo] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');

    const { login, loading, error, isAuthenticated, clearError, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/products');
            }
        }
    }, [isAuthenticated, user, router]);


    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            return;
        }

        try {
            await login({
                username: formData.username,
                password: formData.password
            });
        } catch (err) {
        }
    };

    const fillDemoCredentials = (role = 'user') => {
        if (role === 'admin') {
            setFormData({
                username: 'admin',
                password: 'admin'
            });
        } else {
            setFormData({
                username: 'user',
                password: 'user'
            });
        }
        setSelectedRole(role);
    };

    if (isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className="loading-spinner"></div>
                <p>Redirecting...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorAlert}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={error ? 'error' : ''}
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={error ? 'error' : ''}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <div className="demo-buttons" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => fillDemoCredentials('user')}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                    >
                        Demo User
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemoCredentials('admin')}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                    >
                        Demo Admin
                    </button>
                </div>

                <div className={styles.demoInfo}>
                    <button
                        type="button"
                        onClick={() => setShowDemo(!showDemo)}
                        className={styles.toggleDemo}
                    >
                        {showDemo ? 'Hide' : 'Show'} Demo Credentials
                    </button>

                    {showDemo && (
                        <div className={styles.credentials}>
                            <p><strong>User Login:</strong></p>
                            <p>Username: user</p>
                            <p>Password: user</p>

                            <p style={{ marginTop: '1rem' }}><strong>Admin Login:</strong></p>
                            <p>Username: admin</p>
                            <p>Password: admin</p>

                            <p className={styles.note}>
                                These are mock credentials for testing purposes
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}