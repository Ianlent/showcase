import { useSelector } from "react-redux";

const Navbar = () => {
	const { user } = useSelector((state) => state.auth);

	return (
		<div>
			<div className="fixed h-[10vh] w-full bg-white top-0 flex items-center justify-between z-50">
				<img className="h-full" src="/logo.png" alt="" />
				<div className="h-full flex items-center mr-1">
					<p className="m-0">{user.user_name}</p>
					<img className="h-[80%]" src="/default-profile.jpg" alt="" />
				</div>
			</div>
		</div>
	)
}

export default Navbar