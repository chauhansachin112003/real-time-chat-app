import { configureStore } from "@reduxjs/toolkit";
import sliceuser from "./userslice";
import messageslice from './messageSlice';

export const store = configureStore({
  reducer: {
    user: sliceuser,
    message: messageslice
  }
});