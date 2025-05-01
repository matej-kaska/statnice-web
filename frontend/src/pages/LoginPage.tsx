import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import axiosRequest from "@/utils/axios";
import useUserInfoStore, { type UserInfo } from "@/zustand/userInfo";
import Button from "@/components/Button";
import useCartStore, { CartItems } from "@/zustand/store";

const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const setUserInfo = useUserInfoStore((s) => s.setUserInfo);
  const setCart = useCartStore((s) => s.setCart);
  const [input, setInput] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const issue of result.error.errors) {
        const key = issue.path[0] as keyof LoginInput;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
		const res = await axiosRequest<UserInfo>("POST", "/api/user/token",
			input
		);
		if (!res.success) {
			setErrors({ password: res.message });
			setSubmitting(false);
			return;
		}
		setUserInfo(res.data);
    await getCart();
		setSubmitting(false);
		navigate("/products", { replace: true });
  };

  const getCart = async () => {
    const response = await axiosRequest<CartItems>("GET", "/api/cart/");
    if (response.success) {
      const cart = response.data;
      setCart(cart);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-second/10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border-2 border-main rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-main">
          Log In
        </h2>

        <div className="mb-1">
          <label htmlFor="email" className="block mb-1 text-main">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={input.email}
            onChange={onChange}
            placeholder="E-mail"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <p className={`mt-1 text-sm text-red-500 ${errors.email ? "visible" : "invisible"}`}>
            {errors.email}!
          </p>
        </div>

        <div className="mb-1">
          <label htmlFor="password" className="block mb-1 text-main">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={input.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <p className={`mt-1 text-sm text-red-500 ${errors.password ? "visible" : "invisible"}`}>
            {errors.password}!
          </p>
        </div>

        <div className="flex items-center justify-between">
					<Button
						type="button"
						color="secondary"
						onClick={() => navigate("/register")}
					>
						Register
					</Button>
					<Button
						type="submit"
						disabled={submitting}
						color="primary"
					>
						{submitting ? "Logging in..." : "Log In"}  {/* TODO: LOADING */}
					</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
