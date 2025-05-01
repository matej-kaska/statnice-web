import Button from "@/components/Button";
import CartItem, { type CartItemType } from "@/components/CartItem";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import axiosRequest from "@/utils/axios";
import useCartStore from "@/zustand/store";
import useUserInfoStore from "@/zustand/userInfo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CartFullItem = {
	id: number;
	name: string;
	quantity: number;
	price: number;
};

type CartFullResponse = {
	items: CartFullItem[];
	full_price: number;
};

type Cart = Record<number, number>;

const CartPage = () => {
	const navigate = useNavigate();
	const token = useUserInfoStore((s) => s.userInfo.token);
	const setCart = useCartStore((s) => s.setCart);
	const cart = useCartStore((s) => s.items);
	const clearCartStore = useCartStore((s) => s.clearCart);
	const { openErrorSnackbar, openSuccessSnackbar } = useSnackbar();

	const [items, setItems] = useState<CartFullItem[]>([]);
	const [fullPrice, setFullPrice] = useState(0);
	const [error, setError] = useState("");

	const fetchCart = async () => {
		const resp = await axiosRequest<CartFullResponse>("GET", "/api/cart/full/");

		if (!resp.success) {
			setError(resp.message);
			return;
		}

		const { items: fetched, full_price } = resp.data;
		setItems(fetched);
		setFullPrice(full_price);

		const mapping: Record<number, number> = {};
		// biome-ignore lint/complexity/noForEach: Better to use forEach than a for loop here
		fetched.forEach(({ id, quantity }) => {
			mapping[id] = quantity;
		});
		setCart(mapping);
	};

	useEffect(() => {
		if (!token) {
			navigate("/login", { replace: true });
			return;
		}
		fetchCart();
	}, [token]);

	const updateCart = async (newCart: Cart) => {
		const resp = await axiosRequest<CartFullResponse>("PATCH", "/api/cart/", newCart);
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		fetchCart();
	};

	const handleQuantityChange: CartItemType["onQuantityChange"] = (id, qty) => {
		if (qty < 1) return;
		const newCart = { ...cart };
		newCart[id] = qty;
		updateCart(newCart);
	};

	const handleDelete: CartItemType["onDelete"] = (id) => {
		const newCart = { ...cart };
		newCart[id] = 0;
		updateCart(newCart);
	};

	const handleCreateOrder = async () => {
		if (items.length === 0) return;
		const resp = await axiosRequest("POST", "/api/orders/create/", cart);
		if (resp.success) {
			clearCartStore();
			openSuccessSnackbar("Order created successfully!");
			navigate("/orders", { replace: true });
		} else {
			openErrorSnackbar(resp.message);
		}
	};

	return (
		<div className="max-w-[calc(100%-15rem)] w-full p-4 flex flex-col min-w-80">
			<h1 className="text-2xl font-semibold mb-4 text-main">Your Cart</h1>

			{error && <div className="text-red-500 text-center mb-4">{error}</div>}

			{items.map((it) => (
				<CartItem key={it.id} id={it.id} name={it.name} quantity={it.quantity} price={it.price} onQuantityChange={handleQuantityChange} onDelete={handleDelete} />
			))}
			{items.length === 0 && <div className="text-center py-4 text-gray-500 w-full">Your cart is empty.</div>}

			{items.length > 0 && (
				<div className="mt-6 flex justify-between items-center">
					<span className="text-xl font-medium">Total: {fullPrice.toFixed(2)} Kč</span>
					<Button onClick={handleCreateOrder} color="primary">
						Create Order
					</Button>
				</div>
			)}
		</div>
	);
};

export default CartPage;
