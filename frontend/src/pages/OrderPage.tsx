import Loading from "@/components/Loading";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import axiosRequest from "@/utils/axios";
import { websiteUrl } from "@/utils/consts";
import useUserInfoStore from "@/zustand/userInfo";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type ProductType = {
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	is_low: boolean;
};

type OrderItemType = {
	product: ProductType;
	quantity: number;
	price: number;
};

type OrderDetail = {
	id: number;
	user: {
		email: string;
		first_name: string;
		last_name: string;
	};
	status: string;
	created_at: string;
	updated_at: string;
	items: OrderItemType[];
	full_price: number;
};

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { openErrorSnackbar } = useSnackbar();
	const userInfo = useUserInfoStore((s) => s.userInfo);

	const [order, setOrder] = useState<OrderDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

	const statusClasses: Record<string, string> = {
		pending: "bg-yellow-100 text-yellow-800",
		shipped: "bg-blue-100   text-blue-800",
		delivered: "bg-green-100  text-green-800",
		cancelled: "bg-red-100    text-red-800",
	};

	useEffect(() => {
		if (!id) {
			navigate("/orders", { replace: true });
			return;
		}
		const fetchOrder = async () => {
			setLoading(true);
			const resp = await axiosRequest<OrderDetail>("GET", `/api/orders/${id}/`);
			setLoading(false);
			if (resp.success) {
				setOrder(resp.data);
			} else {
				navigate("/orders", { replace: true });
				openErrorSnackbar(resp.message);
			}
		};
		fetchOrder();
	}, [id, navigate]);

	const setStatus = async (newStatus: string) => {
		const resp = await axiosRequest("PATCH", `/api/orders/${id}/`, {
			status: newStatus,
		});
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
	};

	if (loading) {
		return (
			<div className="flex-1 flex items-center justify-center max-w-4xl mx-auto p-4 space-y-6 w-full h-full">
				<Loading className="w-full h-full"/>
			</div>
		);
	}

	if (!order) {
		return <div className="max-w-4xl mx-auto p-4 text-center text-red-500">Order not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
			<title>{`BasicERP | Order #${order.id}`}</title>
			<meta
				name="description"
				content={`Order #${order.id}: status, items, user details, and total price—view full order history.`}
			/>
			<link rel="canonical" href={`${websiteUrl}/orders/${order.id}`} />
			<div className="flex flex-col md:flex-row md:justify-between md:items-center w-full">
				<h1 className="text-2xl font-semibold">Order #{order.id}</h1>
				<div className="space-y-1 text-gray-600">
					<p>
						Status:
						<span
							className={`
              px-3 pt-0.5 pb-1
              min-w-[5.5rem]
              text-center text-sm font-medium
              rounded-full ml-2
              ${statusClasses[order.status] ?? "bg-gray-100 text-gray-800"}
            `}
						>
							{order.status}
						</span>
					</p>
					<p>
						Created: <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleString()}</span>
					</p>
					<p>
						Updated: <span className="font-medium text-gray-800">{new Date(order.updated_at).toLocaleString()}</span>
					</p>
				</div>
			</div>

			<div className="flex justify-between items-center mb-4 w-full">
				<div className="flex gap-2">
					<p className="text-gray-800 font-medium">
						{order.user.first_name} {order.user.last_name}
					</p>
					<p className="text-gray-600">{order.user.email}</p>
				</div>
				{userInfo.role === "admin" && (
					<select
						value={order.status}
						onChange={(e) => setStatus(e.target.value)}
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
				)}
			</div>

			<div className="border border-gray-200 rounded-md overflow-hidden w-full">
				<h2 className="bg-gray-50 px-4 py-2 font-medium">Items</h2>
				{order.items.map((item) => (
					<div key={item.product.id} className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
						<div className="min-w-0">
							<Link to={`/product/${item.product.id}`} className="font-medium text-gray-800 truncate hover:underline">
								{item.product.name}
							</Link>
						</div>
						<div className="flex items-baseline space-x-4 min-w-60 justify-end">
							<span className="text-gray-800">
								{item.quantity} × {item.price} Kč
							</span>
							<span className="text-gray-800 font-medium">{(item.quantity * item.price).toFixed(2)} Kč</span>
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-end">
				<span className="text-xl font-semibold">Total: {order.full_price.toFixed(2)} Kč</span>
			</div>
		</div>
	);
};

export default OrderPage;
