import { NavLink } from "react-router-dom";

const Sidebar = () => {
	const linkClasses = () => ["block w-full text-center px-4 py-3 mb-2 rounded-md font-medium hover:brightness-95 bg-main text-white"].join(" ");

	return (
		<aside className="h-full min-w-60 bg-white border-r border-gray-200 p-4 flex flex-col">
			<NavLink to="/products" className={linkClasses}>
				Products
			</NavLink>
			<NavLink to="/orders" className={linkClasses}>
				Orders
			</NavLink>
			<NavLink to="/cart" className={`${linkClasses()} mt-auto`}>
				Cart
			</NavLink>
		</aside>
	);
};

export default Sidebar;
