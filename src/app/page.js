'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from './store/authStore';
import styles from './page.module.scss';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/products');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
        <div className={styles.container}>
          <div className="loading-spinner"></div>
          <p>Redirecting to products...</p>
        </div>
    );
  }

  return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>ProductManager</span>
          </h1>
          <p className={styles.subtitle}>
            Manage your e-commerce products with ease. Add, edit, delete, and organize your product catalog efficiently.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📦</div>
              <h3>Product Management</h3>
              <p>Complete CRUD operations for your products</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Search & Filter</h3>
              <p>Find products quickly with advanced search and filtering</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Admin Dashboard</h3>
              <p>Comprehensive dashboard for product administration</p>
            </div>
          </div>

          <div className={styles.cta}>
            <Link href="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/products" className="btn btn-outline btn-lg">
              View Products
            </Link>
          </div>

        </div>
      </div>
  );
}