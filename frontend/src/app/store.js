import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice.js";
import authReducer, {
	logout,
	setCredentials,
} from "../features/auth/authSlice.js";
import customerReducer from "../features/admin/CustomerManagement/customerSlice.js";
import usersReducer from "../features/admin/UsersManagement/usersSlice.js";
import serviceReducer from "../features/admin/ServiceManagement/serviceSlice.js";
import spendingReducer from "../features/admin/FinancialManagement/spendingsSlice.js";
import orderReducer from "../features/admin/OrderHistory/ordersSlice.js";

// Create the listener middleware
const listenerMiddleware = createListenerMiddleware();

// Add the listener
listenerMiddleware.startListening({
	actionCreator: logout,
	effect: (action, listenerApi) => {
		// This is where you trigger your global navigate
		// Assuming you have a router object accessible globally
		localStorage.clear();
		window.history.pushState(null, "", "/login");
		window.dispatchEvent(new PopStateEvent("popstate"));
	},
});

listenerMiddleware.startListening({
	actionCreator: setCredentials,
	effect: (action) => {
		const { user, token } = action.payload;
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
	},
});

export const store = configureStore({
	reducer: {
		auth: authReducer,
		customer: customerReducer,
		users: usersReducer,
		services: serviceReducer,
		spendings: spendingReducer,
		orders: orderReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.prepend(listenerMiddleware.middleware)
			.concat(apiSlice.middleware),
});
