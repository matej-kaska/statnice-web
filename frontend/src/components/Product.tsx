import { NavLink } from "react-router-dom";

export type ProductType = {
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	is_low: boolean;
	low_stock_threshold: number;
};

const Product = ({ id, name, description, price, quantity, is_low }: ProductType) => {
	return (
		<NavLink
			to={`/product/${id}`}
			className="
        flex justify-between items-center
        px-4 py-3
        border-b border-gray-200
        hover:bg-gray-50
        cursor-pointer
        max-w-[100%] min-w-[100%]
      "
		>
			<div className="flex items-center gap-4 min-w-0 max-w-[calc(100%-15rem)]">
				<span className="text-gray-500 min-w-6">{id}</span>
				<div className="flex flex-col min-w-0">
					<span className="font-medium text-gray-800">{name}</span>
					<span className="text-sm text-gray-600 truncate">{description}</span>
				</div>
			</div>

			<div className="flex items-end justify-end gap-4 min-w-[15rem]">
				<span className="text-gray-800">{Number(price).toFixed(2)} Kč</span>
				<span className="text-gray-800">Qty: {quantity}</span>
				{is_low && (
					<span
						className="
            text-white bg-red-500
            rounded px-2 py-0.5
            font-bold
          "
					>
						!
					</span>
				)}
			</div>
		</NavLink>
	);
};

export default Product;
