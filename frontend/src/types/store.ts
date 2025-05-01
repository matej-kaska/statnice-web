export type Product = {
	id: number;
	name: string;
	description: string;
	price: number;
	quantity: number;
	is_low: boolean;
};

export type OrderItem = {
	product: Product;
	quantity: number;
	price: number;
};

export type Order = {
	id: number;
	user: string;
	status: string;
	created_at: string;
	items: OrderItem[];
	full_price: number;
};

export type CreateOrderItemPayload = {
	id: number;
	quantity: number;
};

export type CreateOrderPayload = {
	items: CreateOrderItemPayload[];
};
