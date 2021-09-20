import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const getChatsAsync = createAsyncThunk(
  "message/getChatsAsync",
  async (_, { rejectWithValue }) => {
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

export const getChatAsync = createAsyncThunk(
  "message/getChatAsync",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/chats/${id}`);
      if (response.status === 200) {
        const { chat } = response.data;
        return { chat };
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
      if (response.status === 201 || response.status === 200) {
        const { data } = response.data;
        return { data };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateChatAsync = createAsyncThunk(
  "message/updateChatAsync",
  async ({ id, chatName }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/chats/${id}`, {
        chatName,
      });
      if (response.status === 200) {
        const { chat } = response.data;
        return { chat };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMessageAsync = createAsyncThunk(
  "message/createMessageAsync",
  async ({ content, chatId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/messages", {
        content,
        chatId,
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

export const getChatMessagesAsync = createAsyncThunk(
  "message/getChatMessagesAsync",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/chatMessages/${chatId}`);
      if (response.status === 200) {
        const { messages } = response.data;
        return { messages };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [], // the meaning between these
    chats: [], // two has been interchanged
    chat: null,
    newCreatedMessage: {}, // the meaning between these
    newCreatedChat: {}, // two has been interchanged
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

    [getChatAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [getChatAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.chat = action.payload.chat;
      state.error = null;
    },
    [getChatAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateChatAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [updateChatAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.chat = action.payload.chat;
      state.error = null;
    },
    [updateChatAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createMessageAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [createMessageAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.newCreatedChat = action.payload.data;
      state.chats = [...state.chats, { ...action.payload.data }];
      state.error = null;
    },
    [createMessageAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getChatMessagesAsync.pending]: (state, action) => {
      state.loading = true;
    },
    [getChatMessagesAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.chats = action.payload.messages;
      state.error = null;
    },
    [getChatMessagesAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default messageSlice.reducer;
