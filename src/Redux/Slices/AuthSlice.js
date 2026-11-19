// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../../Helpers/axiosInstance";

// const initialState = {
//   isLoggedIn: localStorage.getItem("isLoggedIn") || false,
//   role: localStorage.getItem("role") || "",
//   data: JSON.parse(localStorage.getItem("data")) || {},
// };

// // .....signup.........
// export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
//   const loadingMessage = toast.loading("Please wait! creating your account...");
//   try {
//     const res = await axiosInstance.post("/user/register", data);
//     toast.success(res?.data?.message, { id: loadingMessage });
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message, { id: loadingMessage });
//     throw error;
//   }
// });

// // .....Login.........
// export const login = createAsyncThunk("/auth/login", async (data) => {
//   const loadingMessage = toast.loading(
//     "Please wait! logging into your account..."
//   );
//   try {
//     const res = await axiosInstance.post("/user/login", data);
//     toast.success(res?.data?.message, { id: loadingMessage });
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message, { id: loadingMessage });
//     throw error;
//   }
// });

// // .....Logout.........
// export const logout = createAsyncThunk("/auth/logout", async () => {
//   const loadingMessage = toast.loading("logout...");
//   try {
//     const res = await axiosInstance.get("/user/logout");
//     toast.success(res?.data?.message, { id: loadingMessage });
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message, { id: loadingMessage });
//     throw error;
//   }
// });

// // .....get user data.........
// export const getUserData = createAsyncThunk("/auth/user/me", async () => {
//   const loadingMessage = toast.loading("fetching profile...");
//   try {
//     const res = await axiosInstance.get("/user/me");
//     toast.success(res?.data?.message, { id: loadingMessage });
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message, { id: loadingMessage });
//     throw error;
//   }
// });

// // .....update user data.........
// export const updateUserData = createAsyncThunk(
//   "/auth/user/me",
//   async (data) => {
//     const loadingMessage = toast.loading("Updating changes...");
//     try {
//       const res = await axiosInstance.post(`/user/update/${data.id}`, data);
//       toast.success(res?.data?.message, { id: loadingMessage });
//       return res?.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message, { id: loadingMessage });
//       throw error;
//     }
//   }
// );

// // .....change user password.......
// export const changePassword = createAsyncThunk(
//   "/auth/user/changePassword",
//   async (userPassword) => {
//     const loadingMessage = toast.loading("Changing password...");
//     try {
//       const res = await axiosInstance.post(
//         "/user/change-password",
//         userPassword
//       );
//       toast.success(res?.data?.message, { id: loadingMessage });
//       return res?.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message, { id: loadingMessage });
//       throw error;
//     }
//   }
// );

// // .....forget user password.....
// export const forgetPassword = createAsyncThunk(
//   "auth/user/forgetPassword",
//   async (email) => {
//     const loadingMessage = toast.loading("Please Wait! sending email...");
//     try {
//       const res = await axiosInstance.post("/user/reset", { email });
//       toast.success(res?.data?.message, { id: loadingMessage });
//       return res?.data;
//     } catch (error) {
//       toast.error(error?.response?.data?.message, { id: loadingMessage });
//       throw error;
//     }
//   }
// );

// // .......reset the user password......
// export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
//   const loadingMessage = toast.loading(
//     "Please Wait! reseting your password..."
//   );
//   try {
//     const res = await axiosInstance.post(`/user/reset/${data.resetToken}`, {
//       password: data.password,
//     });
//     toast.success(res?.data?.message, { id: loadingMessage });
//     return res?.data;
//   } catch (error) {
//     toast.error(error?.response?.data?.message, { id: loadingMessage });
//     throw error;
//   }
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // for signup
//     builder.addCase(createAccount.fulfilled, (state, action) => {
//       localStorage.setItem("data", JSON.stringify(action?.payload?.user));
//       localStorage.setItem("role", action?.payload?.user?.role);
//       localStorage.setItem("isLoggedIn", true);
//       state.data = action?.payload?.user;
//       state.role = action?.payload?.user?.role;
//       state.isLoggedIn = true;
//     });

//     // for login
//     builder.addCase(login.fulfilled, (state, action) => {
//       localStorage.setItem("data", JSON.stringify(action?.payload?.user));
//       localStorage.setItem("role", action?.payload?.user?.role);
//       localStorage.setItem("isLoggedIn", true);
//       state.data = action?.payload?.user;
//       state.role = action?.payload?.user?.role;
//       state.isLoggedIn = true;
//     });

//     // for logout
//     builder.addCase(logout.fulfilled, (state, action) => {
//       localStorage.removeItem("data");
//       localStorage.removeItem("role");
//       localStorage.removeItem("isLoggedIn");
//       state.data = {};
//       state.role = "";
//       state.isLoggedIn = false;
//     });

//     // for get user data
//     builder.addCase(getUserData.fulfilled, (state, action) => {
//       localStorage.setItem("data", JSON.stringify(action?.payload?.user));
//       localStorage.setItem("role", action?.payload?.user?.role);
//       localStorage.setItem("isLoggedIn", true);
//       state.data = action?.payload?.user;
//       state.role = action?.payload?.user?.role;
//       state.isLoggedIn = true;
//     });
//   },
// });

// export const {} = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../Helpers/axiosInstance";

const safeParseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  token: localStorage.getItem("token") || "",
  data: safeParseJSON(localStorage.getItem("data"), {}),
};

// .....signup.........
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  const loadingMessage = toast.loading("Please wait! creating your account...");
  try {
    const res = await axiosInstance.post("/user/register", data);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed", {
      id: loadingMessage,
    });
    throw error;
  }
});

// .....Login.........
export const login = createAsyncThunk("/auth/login", async (data) => {
  const loadingMessage = toast.loading(
    "Please wait! logging into your account..."
  );
  try {
    const res = await axiosInstance.post("/user/login", data);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login failed", {
      id: loadingMessage,
    });
    throw error;
  }
});

// .....Logout.........
export const logout = createAsyncThunk("/auth/logout", async () => {
  const loadingMessage = toast.loading("logout...");
  try {
    const res = await axiosInstance.get("/user/logout");
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout failed", {
      id: loadingMessage,
    });
    throw error;
  }
});

// .....get user data.........
export const getUserData = createAsyncThunk("/auth/user/me", async () => {
  const loadingMessage = toast.loading("fetching profile...");
  try {
    const res = await axiosInstance.get("/user/me");
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch profile", {
      id: loadingMessage,
    });
    throw error;
  }
});

// .....update user data.........
export const updateUserData = createAsyncThunk(
  "/auth/user/update",
  async (data) => {
    const loadingMessage = toast.loading("Updating changes...");
    try {
      const res = await axiosInstance.post(`/user/update/${data.id}`, data);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed", {
        id: loadingMessage,
      });
      throw error;
    }
  }
);

// .....change user password.......
export const changePassword = createAsyncThunk(
  "/auth/user/changePassword",
  async (userPassword) => {
    const loadingMessage = toast.loading("Changing password...");
    try {
      const res = await axiosInstance.post(
        "/user/change-password",
        userPassword
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password change failed", {
        id: loadingMessage,
      });
      throw error;
    }
  }
);

// .....forget user password.....
export const forgetPassword = createAsyncThunk(
  "auth/user/forgetPassword",
  async (email) => {
    const loadingMessage = toast.loading("Please Wait! sending email...");
    try {
      const res = await axiosInstance.post("/user/reset", { email });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send email", {
        id: loadingMessage,
      });
      throw error;
    }
  }
);

// .......reset the user password......
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  const loadingMessage = toast.loading(
    "Please Wait! reseting your password..."
  );
  try {
    const res = await axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Password reset failed", {
      id: loadingMessage,
    });
    throw error;
  }
});

const persistAuthState = (state, payload) => {
  const user = payload?.user || {};
  const token = payload?.token || state.token || "";

  localStorage.setItem("data", JSON.stringify(user));
  localStorage.setItem("role", user?.role || "");
  localStorage.setItem("isLoggedIn", "true");
  if (token) {
    localStorage.setItem("token", token);
  }

  state.data = user;
  state.role = user?.role || "";
  state.token = token;
  state.isLoggedIn = true;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAccount.fulfilled, (state, action) => {
      persistAuthState(state, action.payload);
    });

    builder.addCase(login.fulfilled, (state, action) => {
      persistAuthState(state, action.payload);
    });

    builder.addCase(logout.fulfilled, (state) => {
      localStorage.removeItem("data");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      state.data = {};
      state.role = "";
      state.token = "";
      state.isLoggedIn = false;
    });

    builder.addCase(getUserData.fulfilled, (state, action) => {
      persistAuthState(state, action.payload);
    });
  },
});

export const { } = authSlice.actions;
export default authSlice.reducer;