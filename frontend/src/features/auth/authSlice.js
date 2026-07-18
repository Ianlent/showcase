import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: JSON.parse(localStorage.getItem("user")) || null,
		token: localStorage.getItem("token") || null,
		isAuthenticated: !!localStorage.getItem("token"),
	},
	reducers: {
		// Called by authApiSlice when login succeeds
		setCredentials: (state, action) => {
			const { user, token } = action.payload;
			state.user = user;
			state.token = token;
			state.isAuthenticated = true;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
		},
		initializeAuth: (state) => {
			const storedUser = localStorage.getItem("user");
			const storedToken = localStorage.getItem("token");
			if (storedUser && storedToken) {
				state.user = JSON.parse(storedUser);
				state.token = storedToken;
				state.isAuthenticated = true;
			}
		},
	},
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
