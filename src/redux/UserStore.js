import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    User: [], // Ensure that User is initialized as an array
    status: "idle",
    error: null,
    loading: null,
};

export const UserAPI = createAsyncThunk("/UserSlice/UserAPI", async () => {
    try {
        const request = await fetch(`http://localhost:5000/User/ReadUsers`, { method: "GET" });
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
    name: "User",
    initialState: initialState,
    reducers: {
        defaultUsers: (state, action) => {
            console.log("heyyyyy", action.payload);
        },
        addUser: (state, action) => {
            state.User.push({ ...action.payload, _id: Math.floor(Math.random() * 10000) })
            console.log("added");
        },
        deleteUserredux: (state, action) => {
            state.User.filter(target => target._id !== action.payload._id);
        },
        UpdateusersRedux: (state, action) => {

            const userToUpdate = state.User.find(target => target._id == action.payload.ID)
            if (userToUpdate) {
                userToUpdate.Name = action.payload.Name;
                userToUpdate.Email = action.payload.Email;
                userToUpdate.Password = action.payload.Password;
            }

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(UserAPI.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(UserAPI.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure that User is updated correctly as an array
                state.User = action.payload;
                state.status = "completed";
            })
            .addCase(UserAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "An error occurred";
                state.status = "error";
            });
    },
});

export const { addUser, deleteUserredux, defaultUsers, UpdateusersRedux } = UserSlice.actions;

export default UserSlice.reducer;
