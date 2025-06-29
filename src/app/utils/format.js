export function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

export function renderStars(rating = 0) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) stars.push('★');
        else if (i === fullStars && hasHalfStar) stars.push('☆');
        else stars.push('☆');
    }

    return stars.join('');
}
