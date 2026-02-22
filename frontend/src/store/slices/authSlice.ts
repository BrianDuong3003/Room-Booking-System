import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

interface User {
  id: string;
  email: string;
  role: string; 
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

interface AuthResponseData {
  user: User;
  token: string;
}

interface GenericApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

interface ChangePasswordResponse {
  status: string;
  message: string;
}


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<GenericApiResponse<AuthResponseData>, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<GenericApiResponse<AuthResponseData>, {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getMe: builder.query<GenericApiResponse<{ user: User }>, void>({
      query: () => '/auth/me',
      providesTags: ['User'], 
    }),
    logoutMutation: builder.mutation<GenericApiResponse<null>, void>({
        query: () => ({
            url: '/auth/logout',
            method: 'POST',
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error('Server logout failed: ', error);
          }
        }
    }),
    changePassword: builder.mutation<ChangePasswordResponse, { old_password: string; new_password: string }>({
      query: (passwords) => ({
        url: '/auth/changepass',
        method: 'POST',
        body: passwords,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutationMutation, 
  useChangePasswordMutation,
} = authApiSlice;