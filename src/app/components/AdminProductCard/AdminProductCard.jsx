'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AdminProductCard.module.scss';
import { formatPrice, renderStars } from '../../utils/format';
import StockBadge from "@/app/components/StockBadge/StockBadge";

export default function AdminProductCard({
                                             product,
                                             onEdit,
                                             onDelete,
                                             onCancelDelete,
                                             isDeleteConfirm
                                         }) {
    const [imageError, setImageError] = useState(false);



    const handleImageError = () => {
        setImageError(true);
    };

    const getImageSrc = () => {
        if (imageError) {
            return '/placeholder-image.jpg';
        }
        return product.thumbnail || product.images?.[0] || '/placeholder-image.jpg';
    };

    const isLocalProduct = product.isLocal || product.id < 0;

    return (
        <div className={`${styles.card} ${isDeleteConfirm ? styles.deleteMode : ''} ${isLocalProduct ? styles.localProduct : ''}`}>

            <div className={styles.cardContent}>
                <Link href={`/products/${product.id}`} className={styles.viewLink}>
                    <div className={styles.imageContainer}>
                        <img
                            src={getImageSrc()}
                            alt={product.title}
                            className={styles.image}
                            onError={handleImageError}
                        />
                        {product.discountPercentage > 0 && (
                            <div className={styles.discountBadge}>
                                -{Math.round(product.discountPercentage)}%
                            </div>
                        )}
                        <div className={styles.overlay}>
                            <span className={styles.viewText}>View Details</span>
                        </div>
                    </div>
                </Link>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>{product.title}</h3>
                        <div className={styles.brand}>{product.brand}</div>
                        <div className={styles.productId}>
                            ID: {product.id}
                            {isLocalProduct && <span className={styles.localIndicator}> (Local)</span>}
                        </div>
                    </div>

                    <p className={styles.description}>
                        {product.description?.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description}
                    </p>

                    <div className={styles.details}>
                        <div className={styles.rating}>
                            <span className={styles.stars}>{renderStars(product.rating || 0)}</span>
                            <span className={styles.ratingValue}>({product.rating || 0})</span>
                        </div>

                        <div className={styles.pricing}>
                            <span className={styles.price}>{formatPrice(product.price)}</span>
                            {product.discountPercentage > 0 && (
                                <span className={styles.originalPrice}>
                                    {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                                </span>
                            )}
                        </div>

                        <div className={styles.inventory}>
                            <StockBadge stock={product.stock} />

                        </div>

                        <div className={styles.category}>
                            {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.actions}>
                {isDeleteConfirm ? (
                    <div className={styles.deleteConfirm}>
                        <div className={styles.confirmMessage}>
                            <span>Delete this product?</span>
                        </div>
                        <div className={styles.confirmButtons}>
                            <button
                                onClick={onCancelDelete}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onDelete}
                                className={styles.confirmDeleteBtn}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={onEdit}
                            className={styles.editBtn}
                            title="Edit product"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className={styles.deleteBtn}
                            title="Delete product"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}