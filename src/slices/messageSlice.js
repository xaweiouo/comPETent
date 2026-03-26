import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: 'message',
  initialState: [
    // {
    //   id:1,
    //   type:'danger',
    //   title:'成功',
    //   text:'123456'
    // }
  ],
  reducers: {
    createMessage(state, action) {
      // 從 payload 拿值，並設定「預設值」
      const {
        id,
        message,
        text,
        type = 'success', // 預設是 success
        title = '成功'    // 預設是 成功
      } = action.payload || {};

      state.push({
        id: id,
        // 如果有 message 則強制變危險模式，否則看傳入什麼 type 就用什麼
        type: message ? 'danger' : type,
        title: message ? '失敗' : title,
        text: message || text,
      });
    },
    // createMessage(state, action) {
    //   state.push({
    //     id: action.payload.id,
    //     type: action.payload.message ? 'danger' : 'success',
    //     title: action.payload.message ? '失敗' : '成功',
    //     text: action.payload.message ? action.payload.message : action.payload.text,
    //   })
    // },
    removeMessage(state, action) {
      const index = state.find(message => message.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    }
  }
});

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(createMessage({
      ...payload,
      id: requestId
    }));

    setTimeout(() => {
      dispatch(removeMessage(requestId))
    }, 2000);
  }
)

export const { createMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;