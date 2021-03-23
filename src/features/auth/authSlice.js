import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios'

//creating thunk
export const loginAsync = createAsyncThunk('auth/loginAsync', async ({ usernameOrEmail, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/signin', {
      emailOrUsername: usernameOrEmail, password
    })
    if (response.status === 200) {
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const signupAsync = createAsyncThunk('auth/signupAsync', async ({ firstName, lastName, email, username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/signup', { firstName, lastName, email, username, password });
    if (response.status === 201) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user))
      return { token, user }
    }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const counterSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    authenticated: false,
    authenticating: false,
    error: null,
    message: null
  },
  reducers: {

    isUserLoggedIn: state => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        state.authenticated = true;
        state.user = user;
        state.token = token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.authenticated = false;
      localStorage.clear();
    },

  },
  extraReducers: {
    [loginAsync.pending]: (state, action) => {
      state.authenticating = true;
    },
    [loginAsync.fulfilled]: (state, action) => {
      state.authenticating = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authenticated = true;
      state.error = null;
    },
    [loginAsync.rejected]: (state, action) => {
      state.authenticating = false;
      state.error = action.payload;
    },
    [signupAsync.pending]: (state, action) => {
      state.authenticating = true;
    }, [signupAsync.fulfilled]: (state, action) => {
      state.authenticating = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authenticated = true;
      state.error = null;
    },
    [signupAsync.rejected]: (state, action) => {
      state.authenticating = false;
      state.error = action.payload;
    },
  }
});

export const { logout, isUserLoggedIn } = counterSlice.actions;

export default counterSlice.reducer;
