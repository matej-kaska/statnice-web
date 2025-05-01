import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Bars = () => {
	return (
		<div className="flex flex-col h-full">
			<Navbar />
			<div className="flex flex-row h-full">
				<Sidebar />
				<Outlet />
			</div>
		</div>
	);
};

export default Bars;
