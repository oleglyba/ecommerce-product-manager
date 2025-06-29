'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import AdminProductCard from '../components/AdminProductCard/AdminProductCard';
import ProductFilters from '../components/ProductFilters/ProductFilters';
import Pagination from '../components/Pagination/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton/LoadingSkeleton';
import ProductModal from '../components/ProductModal/ProductModal';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';
import {useProducts} from "@/app/hook/useProducts";

export default function AdminProducts() {
    const router = useRouter();
    const { isAdmin, isAuthenticated } = useAuthStore();

    const {
        products,
        loading,
        error,
        pagination,
        filters,
        handlePageChange,
        handleFiltersChange,
        handleClearFilters,
        handleClearError,
        handleDeleteProduct,
        handleResetChanges,
        hasProducts,
        hasMultiplePages,
        hasActiveFilters
    } = useProducts({
        initialLimit: 12,
        autoFetch: false, // We'll fetch manually after admin check
        errorTimeout: 5000,
        scrollToTop: true
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Redirect if not admin
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, router]);

    // Initialize products when admin loads
    useEffect(() => {
        if (isAdmin) {
            // Manually trigger fetch since autoFetch is disabled
            const { fetchProducts } = useProducts.getState ? useProducts.getState() : {};
            if (fetchProducts) {
                fetchProducts(1, 12);
            } else {
                // Fallback: use the hook's initial fetch
                handleFiltersChange();
            }
        }
    }, [isAdmin, handleFiltersChange]);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleProductDelete = async (productId) => {
        if (deleteConfirm === productId) {
            const result = await handleDeleteProduct(productId);
            if (result.success) {
                setDeleteConfirm(null);
            }
        } else {
            setDeleteConfirm(productId);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        // No need to manually refresh - the store handles it
    };

    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (!isAuthenticated || !isAdmin) {
        return (
            <div className={styles.accessDenied}>
                <div className={styles.accessDeniedContent}>
                    <h2>Access Denied</h2>
                    <p>You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerText}>
                        <h1>Admin Dashboard</h1>
                        <p>Manage your product catalog</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            onClick={handleAddProduct}
                            className={styles.addButton}
                        >
                            <span className={styles.addIcon}>+</span>
                            Add New Product
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className={styles.errorAlert}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <span>{error}</span>
                    <button
                        onClick={handleClearError}
                        className={styles.closeError}
                        aria-label="Close error"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className={styles.filtersSection}>
                <ProductFilters onFiltersChange={handleFiltersChange} />
            </div>

            <div className={styles.results}>
                <div className={styles.resultsInfo}>
                    {!loading && (
                        <p>
                            Managing {products.length} of {pagination.total} products
                            {filters.search && ` for "${filters.search}"`}
                        </p>
                    )}
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton count={12} />
            ) : hasProducts ? (
                <>
                    <div className={styles.productsGrid}>
                        {products.map((product) => (
                            <AdminProductCard
                                key={product.id}
                                product={product}
                                onEdit={() => handleEditProduct(product)}
                                onDelete={() => handleProductDelete(product.id)}
                                onCancelDelete={handleCancelDelete}
                                isDeleteConfirm={deleteConfirm === product.id}
                            />
                        ))}
                    </div>

                    {hasMultiplePages && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            ) : (
                <div className={styles.noProducts}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📦</div>
                        <h3>No products found</h3>
                        <p>
                            {hasActiveFilters
                                ? 'Try adjusting your search criteria or filters'
                                : 'Start by adding your first product'}
                        </p>
                        <div className={styles.emptyActions}>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className={styles.clearFiltersBtn}
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button
                                onClick={handleAddProduct}
                                className={styles.addFirstBtn}
                            >
                                Add First Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}