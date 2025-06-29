'use client';

import styles from './Pagination.module.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
             i <= Math.min(totalPages - 1, currentPage + delta);
             i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.container}>
            <div className={styles.pagination}>
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${styles.pageBtn} ${styles.navBtn}`}
                    aria-label="Previous page"
                >
                    <span className={styles.arrow}>‹</span>
                    <span className={styles.navText}>Previous</span>
                </button>

                {/* Page numbers */}
                <div className={styles.pageNumbers}>
                    {visiblePages.map((page, index) => (
                        <span key={index}>
                            {page === '...' ? (
                                <span className={styles.dots}>...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`${styles.pageBtn} ${
                                        currentPage === page ? styles.active : ''
                                    }`}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </span>
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${styles.pageBtn} ${styles.navBtn}`}
                    aria-label="Next page"
                >
                    <span className={styles.navText}>Next</span>
                    <span className={styles.arrow}>›</span>
                </button>
            </div>

            {/* Page info */}
            <div className={styles.pageInfo}>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    );
}