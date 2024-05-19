import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../redux/UserStore";
import UserTwoReducer from "../redux/UsertwoStore"
export const store = configureStore({
    reducer: {
        User: UserReducer,
        UserTwo: UserTwoReducer,
    }
}) 