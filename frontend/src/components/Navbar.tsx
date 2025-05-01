import { useLocation, useNavigate } from "react-router-dom";
import useUserInfoStore from "@/zustand/userInfo";
import Button from "./Button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useUserInfoStore((s) => s.userInfo);
  const clearUserInfo = useUserInfoStore((s) => s.clearUserInfo);

  let title = "";
  if (location.pathname.startsWith("/products")) {
    title = "Products";
  } else if (location.pathname.startsWith("/orders")) {
    title = "Orders";
  } else if (location.pathname.startsWith("/product")) {
    title = "Product Details";
  } else if (location.pathname.startsWith("/order")) {
    title = "Order Details";
  } else if (location.pathname.startsWith("/cart")) {
    title = "Cart";
  }

  const handleLogout = () => {
    clearUserInfo();
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-main">{title}</h1>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-start">
          <p className="font-medium text-base">
            {userInfo.first_name} {userInfo.last_name}
          </p>
          <p className="text-sm text-gray-600">{userInfo.email}</p>
          <p className="text-sm text-gray-600">Role: {userInfo.role}</p>
        </div>
        <Button
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
