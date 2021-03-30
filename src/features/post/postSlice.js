import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios'

// 
export const createPostAsync = createAsyncThunk('post/createPostAsync', async ({ postMessage }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/posts', { content: postMessage });
        if (response.status === 201) {
            const { createdPost } = response.data;

            return { createdPost }
        }
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

// 
export const getPostsAsync = createAsyncThunk('post/getPostsAsync', async ({ rejectWithValue }) => {
    try {
        const response = await axios.get('/posts');
        if (response.status === 200) {
            const { posts } = response.data;

            return { posts }
        }
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const postSlice = createSlice({
    name: 'auth',
    initialState: {
        posts: [],
        loading: false,
        error: null,
        message: null
    },
    reducers: {
    },
    extraReducers: {

        [createPostAsync.pending]: (state, action) => {
            state.loading = true;
        }, [createPostAsync.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = [{ ...action.payload.createdPost }, ...state.posts];
            state.error = null;
        },
        [createPostAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getPostsAsync.pending]: (state, action) => {
            state.loading = true;
        }, [getPostsAsync.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload.posts;
            state.error = null;
        },
        [getPostsAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// export const { logout, isUserLoggedIn } = counterSlice.actions;

export default postSlice.reducer;
