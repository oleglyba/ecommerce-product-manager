'use client';

import Link from 'next/link';
import styles from './ProductCard.module.scss';
import { formatPrice, renderStars } from '../../utils/format';
import StockBadge from "@/app/components/StockBadge/StockBadge";

export default function ProductCard({ product }) {
    return (
        <div className={styles.card}>
            <Link href={`/products/${product.id}`} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                    <img
                        src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
                        alt={product.title}
                        className={styles.image}
                    />
                    {product.discountPercentage > 0 && (
                        <div className={styles.discountBadge}>
                            -{Math.round(product.discountPercentage)}%
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{product.title}</h3>
                        <div className={styles.brand}>{product.brand}</div>
                    </div>

                    <p className={styles.description}>
                        {product.description?.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                    </p>

                    <div className={styles.rating}>
                        <span className={styles.stars}>{renderStars(product.rating)}</span>
                        <span className={styles.ratingValue}>({product.rating})</span>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.pricing}>
                            <span className={styles.price}>{formatPrice(product.price)}</span>
                            {product.discountPercentage > 0 && (
                                <span className={styles.originalPrice}>
                                    {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                                </span>
                            )}
                        </div>

                        <div className={styles.stock}>
                            <StockBadge stock={product.stock} />

                        </div>
                    </div>

                    <div className={styles.category}>
                        {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                </div>
            </Link>
        </div>
    );
}
