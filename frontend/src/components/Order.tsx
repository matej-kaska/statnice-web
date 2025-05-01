import { Link } from "react-router-dom";

export type OrderType = {
	id: number;
	user: string;
	items: { quantity: number }[];
	full_price: number;
	status: string;
	setStatus: (id: number, newStatus: string) => void;
};

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

const Order = ({ id, user, items, full_price, status, setStatus }: OrderType) => {
	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

	const statusClasses: Record<string, string> = {
		pending: "bg-yellow-100 text-yellow-800",
		shipped: "bg-blue-100   text-blue-800",
		delivered: "bg-green-100  text-green-800",
		cancelled: "bg-red-100    text-red-800",
	};

	return (
		<div
			className="
        flex justify-between items-center
        px-4 py-3
        border-b border-gray-200
        hover:bg-gray-50
        cursor-pointer
      "
		>
			<Link to={`/order/${id}`} className="flex items-center gap-4 min-w-0">
				<span className="text-gray-500 min-w-6">{id}</span>
				<div className="flex flex-col min-w-0">
					<span className="font-medium text-gray-800 truncate">{user}</span>
					<span className="text-sm text-gray-600 truncate">
						Items: {totalQuantity}, {full_price.toFixed(2)} Kč
					</span>
				</div>
			</Link>
			<div className="flex gap-2 items-center">
				<select
					value={status}
					onChange={(e) => setStatus(id, e.target.value)}
					className="
            border border-gray-300 rounded
            px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-main
          "
				>
					{statusOptions.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
				<span
					className={`
          px-3 pt-0.5 pb-1
          min-w-[5.5rem]
          text-center text-sm font-medium
          rounded-full
          ${statusClasses[status] ?? "bg-gray-100 text-gray-800"}
        `}
				>
					{status}
				</span>
			</div>
		</div>
	);
};

export default Order;
