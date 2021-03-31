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
export const likeUnlikePostAsync = createAsyncThunk('post/likeUnlikePostAsync', async ({ postId, isLiked }, { rejectWithValue }) => {
    const url = isLiked ? `/posts/${postId}/unlike` : `/posts/${postId}/like`
    try {
        const response = await axios.put(url);
        if (response.status === 204) {
            return
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
        },
        [createPostAsync.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = [{ ...action.payload.createdPost }, ...state.posts];
            // state.posts.unshift({ ...action.payload.createdPost })
            state.error = null;
        },
        [createPostAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getPostsAsync.pending]: (state, action) => {
            state.loading = true;
        },
        [getPostsAsync.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload.posts;
            state.error = null;
        },
        [getPostsAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [likeUnlikePostAsync.pending]: (state, action) => {
            state.loading = true;
        },
        [likeUnlikePostAsync.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
        },
        [likeUnlikePostAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// export const { logout, isUserLoggedIn } = counterSlice.actions;

export default postSlice.reducer;
