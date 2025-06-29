'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProductStore from '../../store/productsStore';
import styles from './product-detail.module.scss';
import StockBadge from "@/app/components/StockBadge/StockBadge";
import { formatPrice, renderStars } from '../../utils/format';

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const { currentProduct, loading, error, fetchProduct, clearError } = useProductStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (params.id) {
            fetchProduct(parseInt(params.id));
        }
    }, [params.id, fetchProduct]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (currentProduct?.stock || 0)) {
            setQuantity(newQuantity);
        }
    };

    const handleKeyboardQuantityChange = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleQuantityChange(1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleQuantityChange(-1);
        }
    };

    const handleImageSelect = (index) => {
        setSelectedImageIndex(index);
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity} ${currentProduct.title} to cart!`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading} role="status" aria-live="polite">
                    <div className={styles.spinner} aria-hidden="true"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error} role="alert">
                    <div className={styles.errorIcon} aria-hidden="true">⚠️</div>
                    <h2>Error Loading Product</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => router.back()}
                        className={styles.backBtn}
                        type="button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <div className={styles.notFoundIcon} aria-hidden="true">📦</div>
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/products')}
                        className={styles.backBtn}
                        type="button"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const originalPrice = currentProduct.discountPercentage > 0
        ? currentProduct.price / (1 - currentProduct.discountPercentage / 100)
        : null;

    const images = currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.thumbnail || '/placeholder-image.jpg'];

    return (
        <div className={styles.container}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <button
                    onClick={() => router.push('/products')}
                    className={styles.breadcrumbLink}
                    type="button"
                    aria-label="Go back to products page"
                >
                    Products
                </button>
                <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
                <span className={styles.breadcrumbCurrent}>{currentProduct.title}</span>
            </nav>

            <div className={styles.productDetail}>
                <div className={styles.imageSection}>
                    <div className={styles.mainImageContainer}>
                        <img
                            src={images[selectedImageIndex]}
                            alt={`${currentProduct.title} - Main product image`}
                            className={styles.mainImage}
                        />
                        {currentProduct.discountPercentage > 0 && (
                            <div className={styles.discountBadge} aria-label={`${Math.round(currentProduct.discountPercentage)}% discount`}>
                                -{Math.round(currentProduct.discountPercentage)}%
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className={styles.thumbnailContainer} role="tablist" aria-label="Product images">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleImageSelect(index)}
                                    className={`${styles.thumbnail} ${
                                        index === selectedImageIndex ? styles.active : ''
                                    }`}
                                    role="tab"
                                    aria-selected={index === selectedImageIndex}
                                    aria-label={`View image ${index + 1} of ${images.length}`}
                                    type="button"
                                >
                                    <img
                                        src={image}
                                        alt={`${currentProduct.title} - Image ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <div className={styles.category}>
                            {currentProduct.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <h1 className={styles.title}>{currentProduct.title}</h1>
                        {currentProduct.brand && (
                            <div className={styles.brand}>by {currentProduct.brand}</div>
                        )}
                    </div>

                    <div className={styles.rating}>
                        <span
                            className={styles.stars}
                            aria-label={`Rating: ${currentProduct.rating} out of 5 stars`}
                        >
                            {renderStars(currentProduct.rating)}
                        </span>
                        <span className={styles.ratingValue}>({currentProduct.rating})</span>
                    </div>

                    <div className={styles.pricing}>
                        <span className={styles.price} aria-label={`Current price: ${formatPrice(currentProduct.price)}`}>
                            {formatPrice(currentProduct.price)}
                        </span>
                        {originalPrice && (
                            <span
                                className={styles.originalPrice}
                                aria-label={`Original price: ${formatPrice(originalPrice)}`}
                            >
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    <div className={styles.stock}>
                        <StockBadge stock={currentProduct.stock} />
                    </div>

                    <div className={styles.description}>
                        <h2>Description</h2>
                        <p>{currentProduct.description}</p>
                    </div>

                    {currentProduct.stock > 0 && (
                        <div className={styles.purchaseSection}>
                            <div className={styles.quantitySelector}>
                                <label htmlFor="quantity">Quantity:</label>
                                <div className={styles.quantityControls} role="spinbutton" aria-valuenow={quantity} aria-valuemin="1" aria-valuemax={currentProduct.stock}>
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className={styles.quantityBtn}
                                        type="button"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= currentProduct.stock) {
                                                setQuantity(value);
                                            }
                                        }}
                                        onKeyDown={handleKeyboardQuantityChange}
                                        className={styles.quantityInput}
                                        min="1"
                                        max={currentProduct.stock}
                                        aria-label="Product quantity"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= currentProduct.stock}
                                        className={styles.quantityBtn}
                                        type="button"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={styles.addToCartBtn}
                                disabled={currentProduct.stock === 0}
                                type="button"
                                aria-label={`Add ${quantity} ${currentProduct.title} to cart for ${formatPrice(currentProduct.price * quantity)}`}
                            >
                                Add to Cart - {formatPrice(currentProduct.price * quantity)}
                            </button>
                        </div>
                    )}

                    <dl className={styles.productMeta}>
                        <div className={styles.metaItem}>
                            <dt className={styles.metaLabel}>SKU:</dt>
                            <dd className={styles.metaValue}>{currentProduct.sku || currentProduct.id}</dd>
                        </div>
                        <div className={styles.metaItem}>
                            <dt className={styles.metaLabel}>Category:</dt>
                            <dd className={styles.metaValue}>
                                {currentProduct.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </dd>
                        </div>
                        {currentProduct.brand && (
                            <div className={styles.metaItem}>
                                <dt className={styles.metaLabel}>Brand:</dt>
                                <dd className={styles.metaValue}>{currentProduct.brand}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
}