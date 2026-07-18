import { Outlet } from "react-router"
import { Button } from "antd"
const EmployeeLayout = () => {
    const handleClick = async () => {
        await logout();
        localStorage.removeItem("token");
        window.location.reload();
    }
    return (
        <div>
            <div className="bg-red-500">
                <p>A</p>
                <Button onClick={handleClick}>Log out</Button>
                <Outlet />
            </div>
        </div>
    )
}

export default EmployeeLayout