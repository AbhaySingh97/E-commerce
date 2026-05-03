/**
 * Caryqel React Query Hooks
 * Centralized data-fetching hooks with automatic caching, background refetch,
 * and optimistic updates. Replaces all manual useEffect + fetch patterns.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, cartAPI, wishlistAPI, orderAPI, reviewAPI, authAPI } from './api';

// ─── Query Keys ────────────────────────────────────────────────────────────────
// Centralized key factory prevents typos and enables targeted invalidation.
export const queryKeys = {
  products: (params) => ['products', params ?? {}],
  product: (slug) => ['products', slug],
  featured: () => ['products', 'featured'],
  newArrivals: () => ['products', 'new-arrivals'],
  related: (slug) => ['products', slug, 'related'],
  categories: () => ['categories'],
  cart: () => ['cart'],
  wishlist: () => ['wishlist'],
  orders: (params) => ['orders', params ?? {}],
  order: (id) => ['orders', id],
  reviews: (slug, params) => ['reviews', slug, params ?? {}],
  ratingSummary: (slug) => ['reviews', slug, 'summary'],
  profile: () => ['auth', 'me'],
  addresses: () => ['auth', 'me', 'addresses'],
};

// ─── Product Hooks ─────────────────────────────────────────────────────────────

export const useProducts = (params) =>
  useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => productAPI.getProducts(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const useProduct = (slug) =>
  useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => productAPI.getProduct(slug).then((r) => r.data),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: queryKeys.featured(),
    queryFn: () => productAPI.getFeatured().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const useNewArrivals = () =>
  useQuery({
    queryKey: queryKeys.newArrivals(),
    queryFn: () => productAPI.getNewArrivals().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const useRelatedProducts = (slug) =>
  useQuery({
    queryKey: queryKeys.related(slug),
    queryFn: () => productAPI.getRelated(slug).then((r) => r.data),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => productAPI.getCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 10, // 10 minutes — categories change rarely
  });

// ─── Cart Hooks ────────────────────────────────────────────────────────────────

export const useCart = () =>
  useQuery({
    queryKey: queryKeys.cart(),
    queryFn: () => cartAPI.getCart().then((r) => r.data),
    staleTime: 0, // Always fresh
    retry: false,
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => cartAPI.addToCart(data).then((r) => r.data),
    // Optimistic update: instantly add the item in the UI
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() });
      const prev = queryClient.getQueryData(queryKeys.cart());
      queryClient.setQueryData(queryKeys.cart(), (old) => {
        if (!old) return old;
        return {
          ...old,
          items: [...(old.items ?? []), { ...newItem, _optimistic: true }],
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKeys.cart(), ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => cartAPI.updateCartItem(id, data).then((r) => r.data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => cartAPI.removeFromCart(id).then((r) => r.data),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() });
      const prev = queryClient.getQueryData(queryKeys.cart());
      queryClient.setQueryData(queryKeys.cart(), (old) => {
        if (!old) return old;
        return { ...old, items: old.items?.filter((item) => item._id !== id) ?? [] };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKeys.cart(), ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
  });
};

// ─── Wishlist Hooks ────────────────────────────────────────────────────────────

export const useWishlist = () =>
  useQuery({
    queryKey: queryKeys.wishlist(),
    queryFn: () => wishlistAPI.getWishlist().then((r) => r.data),
    retry: false,
  });

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistAPI.addToWishlist(productId).then((r) => r.data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() }),
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistAPI.removeFromWishlist(productId).then((r) => r.data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.wishlist() }),
  });
};

// ─── Order Hooks ───────────────────────────────────────────────────────────────

export const useOrders = (params) =>
  useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => orderAPI.getOrders(params).then((r) => r.data),
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: false,
  });

export const useOrder = (id) =>
  useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderAPI.getOrder(id).then((r) => r.data),
    enabled: !!id,
  });

// ─── Review Hooks ──────────────────────────────────────────────────────────────

export const useReviews = (slug, params) =>
  useQuery({
    queryKey: queryKeys.reviews(slug, params),
    queryFn: () => reviewAPI.getProductReviews(slug, params).then((r) => r.data),
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  });

export const useRatingSummary = (slug) =>
  useQuery({
    queryKey: queryKeys.ratingSummary(slug),
    queryFn: () => reviewAPI.getRatingSummary(slug).then((r) => r.data),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

// ─── Auth Hooks ────────────────────────────────────────────────────────────────

export const useProfile = (isAuthenticated) =>
  useQuery({
    queryKey: queryKeys.profile(),
    queryFn: () => authAPI.getProfile().then((r) => r.data),
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

export const useAddresses = (isAuthenticated) =>
  useQuery({
    queryKey: queryKeys.addresses(),
    queryFn: () => authAPI.getAddresses().then((r) => r.data),
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
