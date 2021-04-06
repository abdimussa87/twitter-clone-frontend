import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios'

// 
export const createPostAsync = createAsyncThunk('post/createPostAsync', async ({ postMessage, replyTo }, { rejectWithValue }) => {
    const post = { content: postMessage, replyTo }
    try {
        const response = await axios.post('/posts', post);
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
export const unRetweetPostAsync = createAsyncThunk('post/unRetweetPostAsync', async ({ postId }, { rejectWithValue }) => {
    const url = `/posts/${postId}/unretweet`
    try {
        const response = await axios.delete(url);
        if (response.status === 200) {
            const { deletedRetweet } = response.data;
            return { deletedRetweet }
        }
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const retweetPostAsync = createAsyncThunk('post/retweetPostAsync', async ({ postId }, { rejectWithValue }) => {
    const url = `/posts/${postId}/retweet`
    try {
        const response = await axios.post(url);
        if (response.status === 201) {
            const { retweetPost } = response.data;
            return { retweetPost }
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
        [unRetweetPostAsync.pending]: (state, action) => {
            state.loading = true;
        },
        [unRetweetPostAsync.fulfilled]: (state, action) => {
            state.loading = false;
            // state.posts = state.posts.filter(post => post._id !== action.payload.deletedRetweet._id)
            state.error = null;
        },
        [unRetweetPostAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [retweetPostAsync.pending]: (state, action) => {
            state.loading = true;
        },
        [retweetPostAsync.fulfilled]: (state, action) => {
            state.loading = false;
            // state.posts = [{ ...action.payload.retweetPost }, ...state.posts];
            state.error = null;
        },
        [retweetPostAsync.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// export const { logout, isUserLoggedIn } = counterSlice.actions;

export default postSlice.reducer;
