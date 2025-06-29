'use client';

import ProductList from '../components/ProductList/ProductList';
import ProductFilters from '../components/ProductFilters/ProductFilters';
import Pagination from '../components/Pagination/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton/LoadingSkeleton';
import styles from './products.module.scss';
import {useProducts} from "@/app/hook/useProducts";

export default function Products() {
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
        hasProducts,
        hasMultiplePages,
        hasActiveFilters,
        isEmpty,
    } = useProducts({ initialLimit: 12 });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Products</h1>
                <p>Browse and manage your product catalog</p>
            </div>

            {error && (
                <div className={styles.errorAlert}>
                    <span>⚠️</span>
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

            <ProductFilters onFiltersChange={handleFiltersChange} />

            <div className={styles.results}>
                <div className={styles.resultsInfo}>
                    {!loading && (
                        <p>
                            Showing {products.length} of {pagination.total} products
                            {filters.search && ` for "${filters.search}"`}
                        </p>
                    )}
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton count={12} />
            ) : hasProducts ? (
                <>
                    <ProductList products={products} />
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
                                : 'No products available at the moment'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="btn btn-outline"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
