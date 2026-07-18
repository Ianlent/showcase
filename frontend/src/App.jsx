import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Loading from "./assets/components/Loading.jsx";

// Protected Route Components
import ProtectedRoute from "./assets/components/ProtectedRoute.jsx"; // Modified to render children
import RedirectIfAuthenticated from "./assets/components/RedirectIfAuthenticated.jsx"; // Modified to use Redux state

// Lazy Imports
const LoginPage = lazy(() => import("./features/auth/Login.jsx"));
const UnauthorizedPage = lazy(() => import("./assets/pages/Unauthorized.jsx"));
const NotFound = lazy(() => import("./assets/pages/NotFound.jsx"));


// Layouts
const AdminLayout = lazy(() => import("./assets/layouts/admin/adminLayout.jsx"));
const EmployeeLayout = lazy(() => import("./assets/layouts/employee/employeeLayout.jsx"));




// Admin Features
const AdminDashboard = lazy(() => import("./features/admin/Dashboard/Dashboard.jsx"));
const UsersManagement = lazy(() => import("./features/admin/UsersManagement/UsersManagement.jsx"));
const CustomerManagement = lazy(() => import("./features/admin/CustomerManagement/CustomerManagement.jsx"));
const ServiceManagementPage = lazy(() => import("./features/admin/ServiceManagement/ServiceManagement.jsx"));
const FinancialManagement = lazy(() => import("./features/admin/FinancialManagement/FinancialManagement.jsx"));
const OrderManagement = lazy(() => import("./features/admin/OrderHistory/OrderHistory.jsx"));

const App = () => {
	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				{/* Public Routes - redirect authenticated users */}
				<Route
					path="/"
					element={
						<RedirectIfAuthenticated>
							<LoginPage />
						</RedirectIfAuthenticated>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectIfAuthenticated>
							<LoginPage />
						</RedirectIfAuthenticated>
					}
				/>

				{/* Admin Routes - Protected and Role-Based */}
				<Route
					path="/admin"
					element={
						<ProtectedRoute allowedRoles={['admin']}>
							<AdminLayout /> {/* AdminLayout will render Navbar, Sidebar, and its own Outlet */}
						</ProtectedRoute>
					}
				>
					{/* Index Route for /admin: Redirects directly to /admin/dashboard */}
					<Route index element={<Navigate to="dashboard" replace />} />
					<Route path="dashboard" element={<AdminDashboard />} />
					<Route path="users-management" element={<UsersManagement />} />
					<Route path="customer-management" element={<CustomerManagement />} />
					<Route path="service-management" element={<ServiceManagementPage />} />
					<Route path="financial-management" element={<FinancialManagement />} />
					<Route path="order-management" element={<OrderManagement />} />
				</Route>

				{/* Employee Routes - Protected and Role-Based */}
				<Route
					path="/employee"
					element={
						<ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
							<EmployeeLayout /> {/* EmployeeLayout will render its own layout and Outlet */}
						</ProtectedRoute>
					}
				>
					{/* Example: Default dashboard for employees */}
					<Route index element={<Navigate to="dashboard" replace />} />
					{/* You would add employee-specific routes here, e.g.: */}
					{/* <Route path="dashboard" element={<EmployeeDashboard />} /> */}
					{/* <Route path="service-entry" element={<ServiceEntryPage />} /> */}
				</Route>

				<Route path="/unauthorized" element={<UnauthorizedPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
};

export default App;