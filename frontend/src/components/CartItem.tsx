import { NavLink } from "react-router-dom";

export type CartItemType = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  onQuantityChange: (id: number, newQty: number) => void;
  onDelete: (id: number) => void;
};

const CartItem = ({
  id,
  name,
  quantity,
  price,
  onQuantityChange,
  onDelete,
}: CartItemType) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
      <NavLink to={`/product/${id}`} className="flex-1 min-w-0 font-medium text-gray-800 truncate hover:underline">
        {name}
      </NavLink>
      <div className="flex items-center justify-end gap-2">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            onQuantityChange(id, Number(e.target.value) || 1)
          }
          className="w-10 py-0.5 border border-gray-300 rounded text-center"
        />

        <button
          onClick={() => onDelete(id)}
          className="text-white focus:outline-none bg-red-600 hover:brightness-95 pb-0.5 px-1 flex items-center justify-center rounded font-bold cursor-pointer"
          aria-label="Remove item"
        >
          ×
        </button>

        <span className="text-gray-800 whitespace-nowrap min-w-25 text-right">
          {(price * quantity).toFixed(2)} Kč
        </span>
      </div>
    </div>
  );
};

export default CartItem;
