import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    UserTwo: [], // Ensure that User is initialized as an array
    status: "idle",
    error: null,
    loading: null,
};

export const UserAPITWO = createAsyncThunk("/UserSlice/UserAPITWO", async () => {
    try {
        const request = await fetch(`http://localhost:5000/Usertwo/usermodeltwo`, { method: "GET" });
        if (!request.ok) {
            throw new Error('Network response was not ok');
        }
        const response = await request.json();
        if (!response) {
            throw new Error("Failed to fetch users");
        }
        console.log(response.FinalOut);
        return response.FinalOut;
    } catch (error) {
        console.error("Fetch error: ", error);
        throw error;
    }
});



const UserSlice = createSlice({
    name: "UserTwo",
    initialState: initialState,
    reducers: {
        findUser: (state, action) => {
            const exactOne = state.UserTwo.find(target => target._id == action.payload._id)
            if (exactOne) return alert("already present here");

            state.UserTwo.unshift(action.payload)
            console.log(state.UserTwo);
        },
        deletetheuser: (state, action) => {
            state.UserTwo.filter(target => target._id !== action.payload._id);
            console.log(state.UserTwo.length);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(UserAPITWO.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(UserAPITWO.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure that User is updated correctly as an array
                state.UserTwo = action.payload;
                state.status = "completed";
            })
            .addCase(UserAPITWO.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "An error occurred";
                state.status = "error";
            });
    },
});

export const { findUser, deletetheuser } = UserSlice.actions;

export default UserSlice.reducer;
