import Order, { type OrderType } from "@/components/Order";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import axiosRequest from "@/utils/axios";
import { websiteUrl } from "@/utils/consts";
import { useEffect, useState } from "react";

type PaginatedResponse<T> = {
	results: T[];
	next: string | null;
	previous: string | null;
	count: number;
};

const orderOptions = [
	{ label: "Created ↑", value: "created_at" },
	{ label: "Created ↓", value: "-created_at" },
	{ label: "Updated ↑", value: "updated_at" },
	{ label: "Updated ↓", value: "-updated_at" },
];

const OrdersPage = () => {
	const { openErrorSnackbar } = useSnackbar();

	const [order, setOrder] = useState<string>("created_at");
	const [orders, setOrders] = useState<OrderType[]>([]);
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPage(`/api/orders/?order=${order}`);
	}, [order]);

	const fetchPage = async (url: string, append = false) => {
		setLoading(true);
		setError("");
		const resp = await axiosRequest<PaginatedResponse<OrderType>>("GET", url);
		setLoading(false);

		if (!resp.success) {
			setError(resp.message);
			return;
		}
		const { results, next } = resp.data;
		setNextUrl(next);
		setOrders((prev) => (append ? [...prev, ...results] : results));
	};

	const setStatus = async (id: number, newStatus: string) => {
		const resp = await axiosRequest("PATCH", `/api/orders/${id}/`, {
			status: newStatus,
		});
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		setOrders((prev) =>
			prev.map((o) => {
				if (o.id === id) {
					return { ...o, status: newStatus };
				}
				return o;
			}),
		);
	};

	return (
		<div className="max-w-[calc(100%-15rem)] p-4 w-full">
			<title>BasicERP | Orders</title>
			<meta
				name="description"
				content="Review all your BasicERP orders: track status, creation and update dates, and view order details."
			/>
			<link rel="canonical" href={`${websiteUrl}/orders`} />
			<div className="flex justify-end mb-4">
				<select
					value={order}
					onChange={(e) => setOrder(e.target.value)}
					className="
            border border-gray-300 rounded
            px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-main
          "
				>
					{orderOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{error && <div className="text-red-500 text-center mb-4">{error}</div>}

			{orders.map((o) => (
				<Order key={o.id} {...o} setStatus={setStatus} />
			))}
			{orders.length === 0 && <div className="text-center py-4 text-gray-500 w-full">No orders found.</div>}

			{nextUrl && (
				<div className="text-center mt-4">
					<button
						onClick={() => fetchPage(nextUrl, true)}
						disabled={loading}
						type="button"
						className="
              bg-main text-white
              px-4 py-2 rounded
              hover:bg-main/90
              disabled:opacity-50
            "
					>
						{loading ? "Loading..." : "Load more"}
					</button>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
