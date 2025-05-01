import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthProvider";
import { ModalProvider } from "./contexts/ModalContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import SnackbarProvider from "./contexts/SnackbarProvider";
import "./style.css";

import Testing from "@/pages/Testing";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductPage from "./pages/ProductPage";
import Bars from "./components/Bars";
import CartPage from "./pages/CartPage";
import { useEffect } from "react";
import axiosRequest from "./utils/axios";
import useCartStore, { CartItems } from "./zustand/store";
import OrderPage from "./pages/OrderPage";

const App = () => {
	const setCart = useCartStore((s) => s.setCart);

	useEffect(() => {
		const getCart = async () => {
			const response = await axiosRequest<CartItems>("GET", "/api/cart/");
			if (response.success) {
				const cart = response.data;
				setCart(cart);
			}
		};

		getCart();
	}, []);

	return (
		<BrowserRouter>
			<SnackbarProvider>
				<ModalProvider>
					<AuthProvider>
						<Routes>
							<Route
								path="/"
								element={
									<ProtectedRoute>
										<LoginPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/register"
								element={
									<ProtectedRoute >
										<RegisterPage />
									</ProtectedRoute>
								}
							/>
							<Route element={<Bars />}>
								<Route
									path="/products"
									element={
										<ProtectedRoute userIsNeeded>
											<ProductsPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/product/:id"
									element={
										<ProtectedRoute userIsNeeded>
											<ProductPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/orders"
									element={
										<ProtectedRoute userIsNeeded>
											<OrdersPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/order/:id"
									element={
										<ProtectedRoute userIsNeeded>
											<OrderPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/cart"
									element={
										<ProtectedRoute userIsNeeded>
											<CartPage />
										</ProtectedRoute>
									}
								/>
								<Route index element={<Navigate to="/products" />} />
							</Route>
							<Route
								path="/testing"
								element={
									<ProtectedRoute>
										<Testing />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</AuthProvider>
				</ModalProvider>
			</SnackbarProvider>
		</BrowserRouter>
	);
};

export default App;
