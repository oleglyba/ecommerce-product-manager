'use client';

import styles from './StockBadge.module.scss';

export default function StockBadge({ stock }) {
    const getStatus = () => {
        if (stock > 10) return { className: styles.inStock, label: `${stock} in stock` };
        if (stock > 0) return { className: styles.lowStock, label: `${stock} in stock` };
        return { className: styles.outOfStock, label: 'Out of stock' };
    };

    const { className, label } = getStatus();

    return (
        <span className={`${styles.stockBadge} ${className}`}>
            {label}
        </span>
    );
}
