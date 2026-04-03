import { createSlice } from "@reduxjs/toolkit";

const messageslice = createSlice({
  name: "message",
  initialState: {
    message: []
  },
  reducers: {
    setusermessage: (state, action) => {
      state.message = action.payload || [];
    }
  }
});

export const { setusermessage } = messageslice.actions;
export default messageslice.reducer;