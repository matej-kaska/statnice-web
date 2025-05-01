import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthProvider";
import { ModalProvider } from "./contexts/ModalContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import SnackbarProvider from "./contexts/SnackbarProvider";
import "./style.css";

import Testing from "@/pages/Testing";
import { useEffect } from "react";
import Bars from "./components/Bars";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import OrderPage from "./pages/OrderPage";
import OrdersPage from "./pages/OrdersPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";
import axiosRequest from "./utils/axios";
import useCartStore, { type CartItems } from "./zustand/store";
import useUserInfoStore from "./zustand/userInfo";

const App = () => {
	const token = useUserInfoStore((s) => s.userInfo.token);
	const setCart = useCartStore((s) => s.setCart);

	useEffect(() => {
		const getCart = async () => {
			if (!token) return;
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
									<ProtectedRoute>
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
