export const formatCategoryName = (category) => {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};