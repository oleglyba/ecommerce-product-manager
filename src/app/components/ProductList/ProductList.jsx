'use client';

import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.scss';

export default function ProductList({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}