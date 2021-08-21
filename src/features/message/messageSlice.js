import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const getChatsAsync = createAsyncThunk(
  "message/getChatsAsync",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`/chats`);
      if (response.status === 200) {
        const { chats } = response.data;
        return { chats };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChatAsync = createAsyncThunk(
  "message/createChatAsync",
  async ({ users }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/chats", {
        users,
      });
      if (response.status === 201) {
        const { data } = response.data;
        return { data };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    newCreatedMessage: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: {
    [createChatAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [createChatAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.newCreatedMessage = action.payload.data;
      state.error = null;
    },
    [createChatAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getChatsAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [getChatsAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.messages = action.payload.chats;
      state.error = null;
    },
    [getChatsAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default messageSlice.reducer;
