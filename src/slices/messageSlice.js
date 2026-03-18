import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice=createSlice({
  name:'message',
  initialState:[],
  reducers:{
    createMessage(state,action){
      state.push({
        id:action.payload.id,
        type:action.payload.message?'danger':'success',
        title:action.payload.message?'失敗':'成功',
        text:action.payload.message?action.payload.message:'成功',
      })
    },
    removeMessage(state,action){
      const index=state.find(message=>message.id===action.payload);
      if(index!==-1){
        state.splice(index,1);
      }
    }
  }
});

export const createAsyncMessage=createAsyncThunk(
  'message/createAsyncMessage',
  async(payload,{dispatch,requestId})=>{
    dispatch(createMessage({
      ...payload,
      id:requestId
    }));

    setTimeout(() => {
      dispatch(removeMessage(requestId))
    }, 2000);
  }
)

export const{createMessage,removeMessage}=messageSlice.actions;
export default messageSlice.reducer;