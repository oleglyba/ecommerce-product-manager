'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import styles from './Header.module.scss';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <h1>ProductManager</h1>
                </Link>
                <nav className={styles.nav}>
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin" className={styles.navLink}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <div className={styles.userSection}>
                                <span className={styles.username}>
                                    Welcome, {user?.firstName || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className={`btn btn-outline btn-sm ${styles.logoutBtn}`}
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-primary btn-sm">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}