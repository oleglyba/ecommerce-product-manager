'use client';

import { useState, useEffect } from 'react';
import useProductStore from '../../store/productsStore';
import styles from './ProductModal.module.scss';
import CategorySelect from "@/app/components/CategorySelect/CategorySelect";

export default function ProductModal({ product, onClose }) {
    const { addProduct, updateProduct, loading, error } = useProductStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        discountPercentage: '',
        rating: '',
        stock: '',
        brand: '',
        category: '',
        thumbnail: '',
        images: []
    });

    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when product changes
    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                discountPercentage: product.discountPercentage?.toString() || '0',
                rating: product.rating?.toString() || '5',
                stock: product.stock?.toString() || '',
                brand: product.brand || '',
                category: product.category || '',
                thumbnail: product.thumbnail || '',
                images: product.images || []
            });
            setImagePreview(product.thumbnail || '');
        } else {
            // Reset form for new product
            setFormData({
                title: '',
                description: '',
                price: '',
                discountPercentage: '0',
                rating: '5',
                stock: '',
                brand: '',
                category: '',
                thumbnail: '',
                images: []
            });
            setImagePreview('');
        }
        setFormErrors({});
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Update image preview when thumbnail URL changes
        if (name === 'thumbnail') {
            setImagePreview(value);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = 'Product title is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Product description is required';
        }

        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            errors.price = 'Please enter a valid price';
        }

        if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            errors.stock = 'Please enter a valid stock quantity';
        }

        if (!formData.brand.trim()) {
            errors.brand = 'Brand is required';
        }

        if (!formData.category) {
            errors.category = 'Please select a category';
        }

        if (formData.discountPercentage && (isNaN(formData.discountPercentage) || parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100)) {
            errors.discountPercentage = 'Discount must be between 0 and 100';
        }

        if (formData.rating && (isNaN(formData.rating) || parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
            errors.rating = 'Rating must be between 0 and 5';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discountPercentage: parseFloat(formData.discountPercentage) || 0,
                rating: parseFloat(formData.rating) || 5,
                stock: parseInt(formData.stock),
                images: formData.thumbnail ? [formData.thumbnail, ...formData.images.filter(img => img !== formData.thumbnail)] : formData.images
            };

            if (product) {
                await updateProduct(product.id, productData);
            } else {
                await addProduct(productData);
            }

            onClose();
        } catch (error) {
            console.error('Failed to save product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageError = () => {
        setImagePreview('');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button
                        onClick={onClose}
                        className={styles.closeBtn}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        <span className={styles.errorIcon}>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.fieldGroup}>
                                <label htmlFor="title" className={styles.label}>
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`${styles.input} ${formErrors.title ? styles.error : ''}`}
                                    placeholder="Enter product title"
                                />
                                {formErrors.title && (
                                    <span className={styles.errorMessage}>{formErrors.title}</span>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label htmlFor="description" className={styles.label}>
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`${styles.textarea} ${formErrors.description ? styles.error : ''}`}
                                    placeholder="Enter product description"
                                    rows="4"
                                />
                                {formErrors.description && (
                                    <span className={styles.errorMessage}>{formErrors.description}</span>
                                )}
                            </div>

                            <div className={styles.row}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="price" className={styles.label}>
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${formErrors.price ? styles.error : ''}`}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                    {formErrors.price && (
                                        <span className={styles.errorMessage}>{formErrors.price}</span>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="discountPercentage" className={styles.label}>
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${formErrors.discountPercentage ? styles.error : ''}`}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                    {formErrors.discountPercentage && (
                                        <span className={styles.errorMessage}>{formErrors.discountPercentage}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="stock" className={styles.label}>
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${formErrors.stock ? styles.error : ''}`}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {formErrors.stock && (
                                        <span className={styles.errorMessage}>{formErrors.stock}</span>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="rating" className={styles.label}>
                                        Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        id="rating"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${formErrors.rating ? styles.error : ''}`}
                                        placeholder="5"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                    />
                                    {formErrors.rating && (
                                        <span className={styles.errorMessage}>{formErrors.rating}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="brand" className={styles.label}>
                                        Brand *
                                    </label>
                                    <input
                                        type="text"
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${formErrors.brand ? styles.error : ''}`}
                                        placeholder="Enter brand name"
                                    />
                                    {formErrors.brand && (
                                        <span className={styles.errorMessage}>{formErrors.brand}</span>
                                    )}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="category" className={styles.label}>
                                        Category *
                                    </label>
                                    <CategorySelect
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                        hasError={!!formErrors.category}
                                        required={true}
                                    />
                                    {formErrors.category && (
                                        <span className={styles.errorMessage}>{formErrors.category}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.imageSection}>
                                <label htmlFor="thumbnail" className={styles.label}>
                                    Product Image
                                </label>
                                <input
                                    type="url"
                                    id="thumbnail"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter image URL"
                                />

                                <div className={styles.imagePreview}>
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className={styles.previewImage}
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            <span className={styles.imageIcon}>📷</span>
                                            <span>No image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    {product ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                product ? 'Update Product' : 'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}