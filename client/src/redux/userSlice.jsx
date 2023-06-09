import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch, unauthorizedResponse } from "../utils/auth";
import { toast } from "react-toastify";

const initialState = {
  userLoading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isSidebarOpen: false,
  email: "",
  password: "",
  name: "",
  role: "",
  allUsers: [],
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const res = await authFetch.post("/user/login", user);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/allUsers",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/user/allUser");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const res = await authFetch.post("/user/register", user);
      thunkAPI.dispatch(clearUserValues());
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    handleUser: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearUserValues: (state) => initialState,
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      localStorage.removeItem("user");
      toast.success("Successfully Logout");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
        state.email = "";
        state.password = "";
        toast.success(payload.msg);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload);
      })
      .addCase(getAllUsers.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
      })
      .addCase(registerUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
        state.name = "";
        state.password = "";
        state.email = "";
        state.role = "";
        toast.success(payload.msg);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload);
      });
  },
});

export const { toggleSidebar, handleUser, clearUserValues, logoutUser } = userSlice.actions;

export default userSlice.reducer;
