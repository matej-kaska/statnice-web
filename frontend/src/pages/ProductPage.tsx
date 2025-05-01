import Button from "@/components/Button";
import GeneralModal from "@/components/GeneralModal";
import Loading from "@/components/Loading";
import ModalEditProduct, { type ProductInput } from "@/components/ModalProduct";
import type { ProductType } from "@/components/Product";
import { useModal } from "@/contexts/ModalContext";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import axiosRequest from "@/utils/axios";
import { websiteUrl } from "@/utils/consts";
import useCartStore from "@/zustand/store";
import useUserInfoStore from "@/zustand/userInfo";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const role = useUserInfoStore((s) => s.userInfo.role);
	const cart = useCartStore((s) => s.items);
	const setCart = useCartStore((s) => s.setCart);
	const { showModal } = useModal();
	const { openErrorSnackbar, openInfoSnackbar, openSuccessSnackbar } = useSnackbar();

	const [product, setProduct] = useState<ProductType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) return;
		fetchProduct();
	}, [id]);

	const fetchProduct = async () => {
		setLoading(true);
		const resp = await axiosRequest<ProductType>("GET", `/api/products/${id}/`);
		setLoading(false);
		if (resp.success) {
			setProduct(resp.data);
		} else {
			setError(resp.message);
		}
	};

	const deleteProduct = async () => {
		const resp = await axiosRequest("DELETE", `/api/products/${id}/`);
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		openSuccessSnackbar("Product deleted successfully!");
		navigate("/products", { replace: true });
	};

	const updateProduct = async (product: ProductInput) => {
		const resp = await axiosRequest("PATCH", `/api/products/${id}/`, product);
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		openInfoSnackbar("Product updated successfully!");
		setProduct((prev) => (prev ? { ...prev, ...product } : null));
		fetchProduct();
	};

	const addToCart = async () => {
		if (!product) return;
		const newCart = { ...cart };
		newCart[product.id] = (cart[product.id] || 0) + 1;

		const resp = await axiosRequest("PATCH", "/api/cart/", {
			...newCart,
		});
		if (!resp.success) {
			openErrorSnackbar(resp.message);
			return;
		}
		setCart(newCart);
		openInfoSnackbar("Product added to cart successfully!");
	};

	if (loading) {
		return <Loading className="w-full" />;
	}

	if (error || !product) {
		return <div className="max-w-2xl mx-auto p-4 text-center text-red-500">{error || "Product not found"}</div>;
	}

	return (
		<div className="w-full mx-auto p-4">
			<title>{`BasicERP | ${product.name}`}</title>
			<meta
				name="description"
				content={`View details for ${product.name} including description, price, available quantity, and stock status.`}
			/>
			<link rel="canonical" href={`${websiteUrl}/product/${product.id}`} />
			<NavLink to={"/products"} className="text-main font-semibold hover:underline cursor-pointer">
				← Back to Products
			</NavLink>

			<div className="mt-6 flex flex-col md:flex-row md:justify-between gap-8">
				<div className="flex-1">
					<h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
					<p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
				</div>

				<div className="flex-shrink-0 flex flex-col items-start md:items-end space-y-4">
					<div className="text-xl font-medium">
						Price: <span className="text-gray-800">{product.price.toLocaleString()} Kč</span>
					</div>
					<div className="flex gap-2">
						<div className="text-lg">
							Quantity: <span className="text-gray-800">{product.quantity}</span>
						</div>
						{product.is_low && <span className="inline-block bg-red-500 text-white px-2 py-0.5 rounded">!</span>}
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<Button color="blue" onClick={addToCart}>
							Add to Cart
						</Button>
						{role === "admin" && (
							<>
								<Button color="primary" className="bg-red-500 hover:bg-red-500/90" onClick={() => showModal(<GeneralModal text={`Do you really want to delete [${product.id}] product?`} actionOnClick={deleteProduct} />)}>
									Delete
								</Button>
								<Button color="primary" onClick={() => showModal(<ModalEditProduct product={product} updateProduct={updateProduct} />)}>
									Edit
								</Button>
							</>
						)}
					</div>
					<span className="text-gray-500 mr-auto">{cart[product.id] ? `In your cart: ${cart[product.id]}` : ""}</span>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
