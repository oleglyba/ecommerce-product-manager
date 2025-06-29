import { useEffect, useCallback } from 'react';
import useProductStore from '../store/productsStore';


export const useProducts = (options = {}) => {
    const {
        initialLimit = 12,
        autoFetch = true,
        errorTimeout = 5000,
        scrollToTop = true
    } = options;

    const {
        products,
        loading,
        error,
        pagination,
        filters,
        fetchProducts,
        clearError,
        resetFilters,
        deleteProduct,
        resetLocalChanges
    } = useProductStore();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, errorTimeout);
            return () => clearTimeout(timer);
        }
    }, [error, clearError, errorTimeout]);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts(1, initialLimit);
        }
    }, [fetchProducts, initialLimit, autoFetch]);

    const handlePageChange = useCallback((page) => {
        fetchProducts(page, pagination.limit);

        if (scrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [fetchProducts, pagination.limit, scrollToTop]);

    const handleFiltersChange = useCallback(() => {
        fetchProducts(1, pagination.limit);
    }, [fetchProducts, pagination.limit]);

    const handleClearFilters = useCallback(() => {
        resetFilters();
        fetchProducts(1, pagination.limit);
    }, [resetFilters, fetchProducts, pagination.limit]);

    const handleClearError = useCallback(() => {
        clearError();
    }, [clearError]);

    const handleRefresh = useCallback(() => {
        fetchProducts(pagination.currentPage, pagination.limit);
    }, [fetchProducts, pagination.currentPage, pagination.limit]);

    const handleDeleteProduct = useCallback(async (productId) => {
        try {
            await deleteProduct(productId);
            const { products, pagination } = useProductStore.getState();
            if (products.length === 0 && pagination.currentPage > 1) {
                fetchProducts(pagination.currentPage - 1, pagination.limit);
            } else {
                fetchProducts(pagination.currentPage, pagination.limit);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, [deleteProduct, fetchProducts]);


    const handleResetChanges = useCallback(() => {
        if (window.confirm('Are you sure you want to reset all local changes? This will restore the original data.')) {
            resetLocalChanges();
            fetchProducts(1, pagination.limit);
        }
    }, [resetLocalChanges, fetchProducts, pagination.limit]);

    return {
        // Store state
        products,
        loading,
        error,
        pagination,
        filters,

        // Handlers
        handlePageChange,
        handleFiltersChange,
        handleClearFilters,
        handleClearError,
        handleRefresh,
        handleDeleteProduct,
        handleResetChanges,

        // Computed values
        hasProducts: products.length > 0,
        hasMultiplePages: pagination.totalPages > 1,
        hasActiveFilters: Boolean(filters.search || filters.category),
        isEmpty: !loading && products.length === 0,

        // Utility functions
        fetchProducts,
        clearError,
        resetFilters,
        deleteProduct,
        resetLocalChanges
    };
};