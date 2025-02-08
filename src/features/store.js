import { configureStore } from "@reduxjs/toolkit";
import reductor from "./reducer";

const store = configureStore({
  reducer: reductor,
});

export default store;
