import Button from "@/components/Button";
import { useModal } from "@/contexts/ModalContext";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import axiosRequest from "@/utils/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const productSchema = z.object({
	name: z.string().nonempty("Name is required"),
	description: z.string().nonempty("Description is required"),
	price: z.coerce.number({ errorMap: () => ({ message: "Price must be a number" }) }).min(0, "Price must be at least 0"),
	quantity: z.coerce
		.number({ errorMap: () => ({ message: "Quantity must be a number" }) })
		.int("Quantity must be an integer")
		.min(0, "Quantity must be at least 0"),
	low_stock_threshold: z.coerce
		.number({ errorMap: () => ({ message: "Threshold must be a number" }) })
		.int("Threshold must be an integer")
		.min(0, "Threshold must be at least 0"),
});

export type ProductInput = z.infer<typeof productSchema>;

type ModalProductProps = {
	product?: ProductInput;
	updateProduct?: (product: ProductInput) => Promise<void>;
};

const ModalProduct = ({ product, updateProduct }: ModalProductProps) => {
	const { openErrorSnackbar, openSuccessSnackbar } = useSnackbar();
	const { closeModal } = useModal();
	const navigate = useNavigate();
	const [values, setValues] = useState<ProductInput>({ name: "", description: "", price: 0, quantity: 0, low_stock_threshold: 0 });
	const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});

	useEffect(() => {
		if (product) {
			setValues({ ...product });
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setValues((v) => ({ ...v, [name]: value }));
		setErrors((errs) => ({ ...errs, [name]: undefined }));
	};

	const handleSubmit = async () => {
		const result = productSchema.safeParse(values);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof ProductInput, string>> = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as keyof ProductInput;
				fieldErrors[key] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}
		if (updateProduct) {
			await updateProduct(result.data);
		} else {
			const resp = await axiosRequest<{ id: string }>("POST", "/api/products/create/", result.data);
			if (!resp.success) {
				openErrorSnackbar(resp.message);
				return;
			}
			openSuccessSnackbar("Product created successfully!");
			navigate(`/product/${resp.data.id}`, { replace: true });
		}
		closeModal();
	};

	return (
		<div className="w-full min-w-160 bg-white rounded-lg p-6 flex flex-col">
			<h1 className="text-2xl font-semibold mb-6">{product ? "Update" : "Create"} Product</h1>
			<div>
				<label className="block text-sm font-medium mb-1">Name</label>
				<input name="name" value={values.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
				<p className={`text-red-500 text-sm mt-1 ${errors.name ? "visible" : "invisible"}`}>{errors.name}!</p>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Description</label>
				<textarea name="description" value={values.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows={8} />
				<p className={`text-red-500 text-sm mt-1 ${errors.description ? "visible" : "invisible"}`}>{errors.description}!</p>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Price</label>
				<input name="price" type="number" step="0.01" value={values.price} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
				<p className={`text-red-500 text-sm mt-1 ${errors.price ? "visible" : "invisible"}`}>{errors.price}!</p>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Quantity</label>
				<input name="quantity" type="number" value={values.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
				<p className={`text-red-500 text-sm mt-1 ${errors.quantity ? "visible" : "invisible"}`}>{errors.quantity}!</p>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
				<input name="low_stock_threshold" type="number" value={values.low_stock_threshold} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
				<p className={`text-red-500 text-sm mt-1 ${errors.low_stock_threshold ? "visible" : "invisible"}`}>{errors.low_stock_threshold}!</p>
			</div>

			<div className="mt-6 flex justify-between gap-3">
				<Button color="secondary" onClick={closeModal}>
					Cancel
				</Button>
				<Button color="primary" type="submit" onClick={handleSubmit}>
					{product ? "Update" : "Create"}
				</Button>
			</div>
		</div>
	);
};

export default ModalProduct;
