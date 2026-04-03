import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",
  initialState: {
    userdata: null,
    otherusers: [],
    selecteduser: null,
    socket:null,
    onlineUsers:[]
  },
  reducers: {
    setuserdata: (state, action) => {
      state.userdata = action.payload;
    },
    setOtherusers: (state, action) => {
      state.otherusers = action.payload || [];
    },
    setSelecteduser: (state, action) => {
      state.selecteduser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineusers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  }
});

export const { setuserdata, setOtherusers, setSelecteduser,setOnlineusers,setSocket } = userslice.actions;
export default userslice.reducer;