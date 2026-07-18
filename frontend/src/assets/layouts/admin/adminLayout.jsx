import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, Suspense } from "react";
import { useSelector } from "react-redux"; // To get user role for validation
import Loading from "../../components/Loading.jsx";

import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const AdminLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user); // Get user from Redux for role validation



	// Effect to handle initial redirection based on last visited path
	useEffect(() => {

		if (location.pathname === "/admin") {
			const lastVisitedAdminPath = localStorage.getItem("lastVisitedAdminPath");

			if (lastVisitedAdminPath && lastVisitedAdminPath.startsWith("/admin/") && user?.user_role === 'admin') {
				navigate(lastVisitedAdminPath, { replace: true });
			} else {
				navigate("/admin/dashboard", { replace: true });
			}
		}
	}, [location.pathname, navigate, user]);


	useEffect(() => {
		if (location.pathname.startsWith("/admin/") && location.pathname !== "/admin") {
			localStorage.setItem("lastVisitedAdminPath", location.pathname);
		}
	}, [location.pathname]);

	return (
		<div>
			<Sidebar role="admin" />
			<Navbar />
			<div className="flex-1 pt-[10vh] ml-16 mr-4">
				<Suspense fallback={<Loading />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};

export default AdminLayout;