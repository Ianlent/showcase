import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsersGear, faUsersViewfinder, faHandHoldingDollar, faArrowRightFromBracket, faListCheck, faCheckToSlot, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice.js';


const Sidebar = ({ role }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const location = useLocation(); // Keep useLocation for isActive checks
	const expand = () => {
		setIsExpanded(true);
	};
	const close = () => {
		setIsExpanded(false);
	};

	const barData = {
		admin: [
			{
				icon: faHouse,
				text: "Dashboard",
				linkTo: "dashboard", // Relative path
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/dashboard",
			},
			{
				icon: faUsersGear,
				text: "Users Management",
				linkTo: "users-management",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/users-management",
			},
			{
				icon: faUsersViewfinder,
				text: "Customer Management",
				linkTo: "customer-management",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/customer-management",
			},
			{
				icon: faCheckToSlot,
				text: "Services Management",
				linkTo: "service-management",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/service-management",
			},
			{
				icon: faHandHoldingDollar,
				text: "Financial Management",
				linkTo: "financial-management",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/financial-management",
			},
			{
				icon: faListCheck,
				text: "Order Management",
				linkTo: "order-management",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/order-management"
			},
			{
				icon: faTriangleExclamation,
				text: "Customer debt tracking",
				linkTo: "debt-tracking",
				isExpanded: isExpanded,
				isActive: location.pathname === "/admin/debt-tracking"
			},
			{
				icon: faArrowRightFromBracket,
				text: "Logout",
				linkTo: "/logout", // Use a distinct path for logout
				isExpanded: isExpanded,
			}
		]
	};

	const currentData = barData[role];

	return (
		<div>
			<div className="h-[90vh] mt-[10vh] pt-[1%] bg-[#091D34] fixed top-0 left-0 text-base flex flex-col items-center transition-[width] duration-300 z-50 w-12 hover:w-60" onMouseEnter={expand} onMouseLeave={close}>
				<div className='h-full w-full flex flex-col items-start justify-start px-1 overflow-hidden text-white '>
					{/* Filter out the logout link to render it separately at the bottom */}
					{currentData.filter(item => item.linkTo !== '/logout').map((item, index) => (
						<SidebarLink key={index} {...item} />
					))}
				</div>
				<div className='w-full px-1 overflow-hidden text-red-500'>
					{/* Render the logout link separately */}
					<SidebarLink key={'logout'} {...currentData[currentData.length - 1]} />
				</div>
			</div>
		</div>
	);
};

const SidebarLink = ({ icon, text, linkTo, isExpanded, isActive }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch(); // Get the dispatch function

	const redirect = async () => {
		try {
			if (linkTo === '/logout') {
				dispatch(logout()); // Dispatch the Redux logout action
			} else {
				navigate(linkTo); // Navigate to the specified internal route
			}
		} catch (error) {
			message.error("An error occurred during navigation or logout.");
			console.error("Logout/Navigation error:", error);
		}
	};

	return (
		<div className={`cursor-pointer w-[90%] mb-1 border-none rounded-lg text-left transition-[padding] duration-100 flex flex-col pl-1 py-2 hover:pl-5 ${isActive ? 'bg-[#59708a5d]' : ''} ${isExpanded ? 'ml-1.5' : ''}`} onClick={redirect}>
			<div className='flex flex-row items-center no-underline whitespace-nowrap px-0.5'>
				<FontAwesomeIcon className='py-1' icon={icon} />
				{isExpanded && <span className='ml-2.5 text-sm'>{text}</span>}
			</div>
		</div>
	);
};

export default Sidebar;