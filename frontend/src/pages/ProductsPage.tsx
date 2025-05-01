import { useEffect, useState } from "react";
import axiosRequest from "@/utils/axios";
import Product, { ProductType } from "@/components/Product";
import { useModal } from "@/contexts/ModalContext";
import ModalProduct from "@/components/ModalProduct";

type PaginatedResponse<T> = {
  results: T[];
  next: string | null;
  previous: string | null;
  count: number;
};

const orderOptions = [
  { label: "Name ↑", value: "name" },
  { label: "Name ↓", value: "-name" },
  { label: "Quantity ↑", value: "quantity" },
  { label: "Quantity ↓", value: "-quantity" },
  { label: "Price ↑", value: "price" },
  { label: "Price ↓", value: "-price" },
];

const ProductsPage = () => {
  const { showModal } = useModal();
  
  const [order, setOrder] = useState<string>("name");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchPage(`/api/products/?order=${order}`);
  }, [order]);

  const fetchPage = async (url: string, append = false) => {
    setLoading(true);
    setError("");
    const resp = await axiosRequest<PaginatedResponse<ProductType>>(
      "GET",
      url
    );
    setLoading(false);

    if (!resp.success) {
      setError(resp.message);
      return;
    }
    const { results, next } = resp.data;
    setNextUrl(next);
    setProducts((prev) => (append ? [...prev, ...results] : results));
  };


  return (
    <div className="max-w-[calc(100%-15rem)] p-4 w-full">
      <div className="flex justify-end mb-4 gap-4">
        <button
          className="inline-block bg-green-600 text-white px-3.5 pb-1.25 rounded text-2xl hover:brightness-95 cursor-pointer"
          onClick={() => showModal(<ModalProduct />)}
        >
          +
        </button>
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

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {products.map((p) => (
        <Product key={p.id} {...p} />
      ))}
      {products.length === 0 && (
        <div className="text-center py-4 text-gray-500 w-full">
          No products found.
        </div>
      )}

      {nextUrl && (
        <div className="text-center mt-4">
          <button
            onClick={() => fetchPage(nextUrl, true)}
            disabled={loading}
            className="
              bg-main text-white
              px-4 py-2 rounded
              hover:bg-main/90
              disabled:opacity-50
              cursor-pointer
            "
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;