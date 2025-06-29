'use client';

import { useState, useEffect } from 'react';
import useProductStore from '../../store/productsStore';
import { formatCategoryName } from '../../utils/formatUtils';
import styles from './ProductFilters.module.scss';
import CategorySelect from "@/app/components/CategorySelect/CategorySelect";

export default function ProductFilters({ onFiltersChange }) {
    const { filters, updateFilters } = useProductStore();
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleSearchChange = (e) => {
        const newFilters = { ...localFilters, search: e.target.value };
        setLocalFilters(newFilters);
        updateFilters(newFilters);

        // Debounce search
        clearTimeout(handleSearchChange.timeout);
        handleSearchChange.timeout = setTimeout(() => {
            onFiltersChange();
        }, 500);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        updateFilters(newFilters);
        onFiltersChange();
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            category: '',
            sortBy: 'title',
            order: 'asc'
        };
        setLocalFilters(resetFilters);
        updateFilters(resetFilters);
        onFiltersChange();
    };

    const hasActiveFilters = localFilters.search || localFilters.category ||
        localFilters.sortBy !== 'title' || localFilters.order !== 'asc';

    return (
        <div className={styles.container}>
            <div className={styles.filtersRow}>
                <div className={styles.searchGroup}>
                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={localFilters.search}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        {localFilters.search && (
                            <button
                                onClick={() => handleFilterChange('search', '')}
                                className={styles.clearSearch}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <CategorySelect
                        value={localFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className={styles.select}
                    />
                </div>

                <div className={styles.sortGroup}>
                    <select
                        value={localFilters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className={styles.select}
                    >
                        <option value="title">Sort by Title</option>
                        <option value="price">Sort by Price</option>
                        <option value="rating">Sort by Rating</option>
                        <option value="brand">Sort by Brand</option>
                    </select>
                </div>

                <div className={styles.orderGroup}>
                    <select
                        value={localFilters.order}
                        onChange={(e) => handleFilterChange('order', e.target.value)}
                        className={styles.select}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <button
                    onClick={handleReset}
                    className="btn btn-outline btn-sm"
                    disabled={!hasActiveFilters}
                >
                    Reset
                </button>

            </div>

            {hasActiveFilters && (
                <div className={styles.activeFilters}>
                    <span className={styles.activeFiltersLabel}>Active filters:</span>
                    <div className={styles.activeFiltersList}>
                        {localFilters.search && (
                            <span className={styles.activeFilter}>
                                Search: "{localFilters.search}"
                                <button
                                    onClick={() => handleFilterChange('search', '')}
                                    className={styles.removeFilter}
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {localFilters.category && (
                            <span className={styles.activeFilter}>
                                Category: {formatCategoryName(localFilters.category)}
                                <button
                                    onClick={() => handleFilterChange('category', '')}
                                    className={styles.removeFilter}
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {(localFilters.sortBy !== 'title' || localFilters.order !== 'asc') && (
                            <span className={styles.activeFilter}>
                                Sort: {localFilters.sortBy} ({localFilters.order})
                                <button
                                    onClick={() => {
                                        handleFilterChange('sortBy', 'title');
                                        handleFilterChange('order', 'asc');
                                    }}
                                    className={styles.removeFilter}
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
