'use client';

import styles from './LoadingSkeleton.module.scss';

function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={styles.imageLoader}></div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={`${styles.skeleton} ${styles.title}`}></div>
                    <div className={`${styles.skeleton} ${styles.brand}`}></div>
                </div>
                <div className={`${styles.skeleton} ${styles.description} ${styles.line1}`}></div>
                <div className={`${styles.skeleton} ${styles.description} ${styles.line2}`}></div>
                <div className={`${styles.skeleton} ${styles.description} ${styles.line3}`}></div>
                <div className={styles.rating}>
                    <div className={`${styles.skeleton} ${styles.stars}`}></div>
                    <div className={`${styles.skeleton} ${styles.ratingValue}`}></div>
                </div>
                <div className={styles.footer}>
                    <div className={`${styles.skeleton} ${styles.price}`}></div>
                    <div className={`${styles.skeleton} ${styles.stock}`}></div>
                </div>
                <div className={`${styles.skeleton} ${styles.category}`}></div>
            </div>
        </div>
    );
}

export default function LoadingSkeleton({ count = 12 }) {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {Array.from({ length: count }, (_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        </div>
    );
}