import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

//creating thunk
export const getUserAsync = createAsyncThunk(
  "user/getUserAsync",
  async ({ username,hasReply }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${username}?hasReply=${hasReply}`);
      if (response.status === 200) {
        const { user,posts} = response.data;
        
        return { user,posts };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const signupAsync = createAsyncThunk(
//   "auth/signupAsync",
//   async (
//     { firstName, lastName, email, username, password },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post("/signup", {
//         firstName,
//         lastName,
//         email,
//         username,
//         password,
//       });
//       if (response.status === 201) {
//         const { token, user } = response.data;
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         return { token, user };
//       }
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    posts:[],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: {
    [getUserAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.posts =action.payload.posts;
      state.error = null;
    },
    [getUserAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // [signupAsync.pending]: (state, action) => {
    //   state.authenticating = true;
    // },
    // [signupAsync.fulfilled]: (state, action) => {
    //   state.authenticating = false;
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.authenticated = true;
    //   state.error = null;
    // },
    // [signupAsync.rejected]: (state, action) => {
    //   state.authenticating = false;
    //   state.error = action.payload;
    // },
  },
});


export default userSlice.reducer;
