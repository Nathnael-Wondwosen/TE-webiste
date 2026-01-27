import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch only approved and verified products for marketplace consistency
      const { data } = await api.get('/products?approved=true&verified=true');
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to load products');
    }
  }
);

export const fetchMarketplaceListings = createAsyncThunk(
  'products/fetchMarketplaceListings',
  async ({ listingType = 'all', seller = null, includeUnapproved = false } = {}, { rejectWithValue }) => {
    try {
      let url = '/products';
      const params = [];
      
      // Add approval filters by default, except for user's own products or when explicitly requested
      if (!seller && !includeUnapproved) {
        params.push('approved=true', 'verified=true');
      }
      
      if (listingType !== 'all') {
        params.push(`listingType=${listingType}`);
      }
      
      if (seller) {
        params.push(`seller=${seller}`);
      }
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const { data } = await api.get(url);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to load marketplace listings');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to create product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMarketplaceListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMarketplaceListings.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchMarketplaceListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
