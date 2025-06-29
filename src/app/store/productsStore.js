import { create } from 'zustand';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useProductStore = create((set, get) => ({
    allProducts: [], // ← для збереження повного списку
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 12,
        total: 0,
        totalPages: 0
    },
    filters: {
        search: '',
        category: '',
        sortBy: 'title',
        order: 'asc'
    },

    fetchProducts: async (page = 1, limit = 12) => {
        set({ loading: true, error: null });

        try {
            const { search, category, sortBy, order } = get().filters;
            let url = `${API_BASE_URL}/products?limit=1000`; // беремо багато для фільтрації вручну

            if (search) {
                url = `${API_BASE_URL}/products/search?q=${search}`;
            }

            if (category) {
                url = `${API_BASE_URL}/products/category/${category}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            let sortedProducts = [...data.products];

            if (sortBy) {
                sortedProducts.sort((a, b) => {
                    let aValue = a[sortBy];
                    let bValue = b[sortBy];

                    if (typeof aValue === 'string') {
                        aValue = aValue.toLowerCase();
                        bValue = bValue.toLowerCase();
                    }

                    return order === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
                });
            }

            const localProducts = get().allProducts.filter(p => p.id >= 1000000);
            const allCombined = [...localProducts, ...sortedProducts];

            const paginated = allCombined.slice((page - 1) * limit, page * limit);

            set({
                allProducts: allCombined,
                products: paginated,
                pagination: {
                    currentPage: page,
                    limit,
                    total: allCombined.length,
                    totalPages: Math.ceil(allCombined.length / limit)
                },
                loading: false
            });
        } catch (error) {
            set({ loading: false, error: error.message || 'Failed to fetch products' });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true, error: null });

        try {
            const localProduct = get().allProducts.find(p => p.id === id);
            if (localProduct) {
                set({ currentProduct: localProduct, loading: false });
                return;
            }

            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');

            const product = await response.json();
            set({ currentProduct: product, loading: false });
        } catch (error) {
            set({ loading: false, error: error.message || 'Failed to fetch product' });
        }
    },

    addProduct: async (productData) => {
        const newId = Date.now();
        const newProduct = { ...productData, id: newId };

        const updatedAll = [newProduct, ...get().allProducts];
        const { currentPage, limit } = get().pagination;
        const paginated = updatedAll.slice((currentPage - 1) * limit, currentPage * limit);

        set({
            allProducts: updatedAll,
            products: paginated,
            pagination: {
                ...get().pagination,
                total: updatedAll.length,
                totalPages: Math.ceil(updatedAll.length / limit)
            }
        });

        return newProduct;
    },

    updateProduct: async (id, productData) => {
        try {
            const existing = get().allProducts.find(p => p.id === id);
            if (!existing) throw new Error('Product not found');

            const updatedProduct = { ...existing, ...productData, id };
            const updatedAll = get().allProducts.map(p => p.id === id ? updatedProduct : p);
            const { currentPage, limit } = get().pagination;
            const paginated = updatedAll.slice((currentPage - 1) * limit, currentPage * limit);

            set({
                allProducts: updatedAll,
                products: paginated
            });

            return updatedProduct;
        } catch (error) {
            set({ error: error.message || 'Failed to update product' });
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const existing = get().allProducts.find(p => p.id === id);
            if (!existing) throw new Error('Product not found');

            const updatedAll = get().allProducts.filter(p => p.id !== id);
            const { currentPage, limit } = get().pagination;
            const paginated = updatedAll.slice((currentPage - 1) * limit, currentPage * limit);

            set({
                allProducts: updatedAll,
                products: paginated,
                pagination: {
                    ...get().pagination,
                    total: updatedAll.length,
                    totalPages: Math.ceil(updatedAll.length / limit)
                }
            });
        } catch (error) {
            set({ error: error.message || 'Failed to delete product' });
            throw error;
        }
    },

    updateFilters: (newFilters) => {
        set(state => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    resetFilters: () => {
        set({
            filters: {
                search: '',
                category: '',
                sortBy: 'title',
                order: 'asc'
            }
        });
    },

    clearError: () => set({ error: null }),
}));

export default useProductStore;