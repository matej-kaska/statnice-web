import Button from "@/components/Button";
import axiosRequest from "@/utils/axios";
import { websiteUrl } from "@/utils/consts";
import useUserInfoStore, { type UserInfo } from "@/zustand/userInfo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
	.object({
		first_name: z.string().nonempty("First name is required").min(2, "First name must be at least 2 characters"),
		last_name: z.string().nonempty("Last name is required").min(2, "Last name must be at least 2 characters"),
		email: z.string().nonempty("Email is required").email("Invalid email"),
		password: z.string().nonempty("Password is required").min(8, "Password must be at least 8 characters"),
		confirm_password: z.string().nonempty("Please confirm password"),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords do not match",
	});

type RegisterInput = z.infer<typeof registerSchema>;

const RegisterPage = () => {
	const navigate = useNavigate();
	const setUserInfo = useUserInfoStore((s) => s.setUserInfo);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
	const [input, setInput] = useState<RegisterInput>({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput({ ...input, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: undefined });
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = registerSchema.safeParse(input);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
			for (const issue of result.error.issues) {
				const k = issue.path[0] as keyof RegisterInput;
				fieldErrors[k] = issue.message;
			}
			setErrors(fieldErrors);
			return;
		}

		setSubmitting(true);

		const res = await axiosRequest<{
			token: string;
			user: UserInfo;
		}>("POST", "/api/user/register", input);

		if (!res.success) {
			console.log(res);
			setErrors({ confirm_password: res.message });
			setSubmitting(false);
			return;
		}

		setUserInfo({ ...res.data.user, token: res.data.token });
		setSubmitting(false);
		navigate("/products", { replace: true });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-second/10">
			<title>BasicERP | Register</title>
			<meta
				name="description"
				content="Create a new BasicERP account to start managing your product catalog, orders, and stock levels."
			/>
			<link rel="canonical" href={`${websiteUrl}/register`} />
			<form onSubmit={onSubmit} className="w-full max-w-md bg-white border-2 border-main rounded-2xl p-6 shadow-lg">
				<h2 className="text-2xl font-semibold mb-6 text-main">Register</h2>
				<div className="mb-1">
					<label htmlFor="first_name" className="block mb-1 text-main">
						First Name
					</label>
					<input id="first_name" name="first_name" value={input.first_name} onChange={onChange} placeholder="First Name" className="w-full px-3 py-2 border border-gray-300 rounded" />
					<p className={`mt-1 text-sm text-red-500 ${errors.first_name ? "visible" : "invisible"}`}>{errors.first_name}!</p>
				</div>
				<div className="mb-1">
					<label htmlFor="last_name" className="block mb-1 text-main">
						Last Name
					</label>
					<input id="last_name" name="last_name" value={input.last_name} onChange={onChange} placeholder="Last Name" className="w-full px-3 py-2 border border-gray-300 rounded" />
					<p className={`mt-1 text-sm text-red-500 ${errors.last_name ? "visible" : "invisible"}`}>{errors.last_name}!</p>
				</div>
				<div className="mb-1">
					<label htmlFor="email" className="block mb-1 text-main">
						E-mail
					</label>
					<input id="email" name="email" type="email" value={input.email} onChange={onChange} placeholder="E-mail" className="w-full px-3 py-2 border border-gray-300 rounded" />
					<p className={`mt-1 text-sm text-red-500 ${errors.email ? "visible" : "invisible"}`}>{errors.email}!</p>
				</div>
				<div className="mb-1">
					<label htmlFor="password" className="block mb-1 text-main">
						Password
					</label>
					<input id="password" name="password" type="password" value={input.password} onChange={onChange} placeholder="Password" className="w-full px-3 py-2 border border-gray-300 rounded" />
					<p className={`mt-1 text-sm text-red-500 ${errors.password ? "visible" : "invisible"}`}>{errors.password}!</p>
				</div>
				<div className="mb-1">
					<label htmlFor="confirm_password" className="block mb-1 text-main">
						Confirm Password
					</label>
					<input id="confirm_password" name="confirm_password" type="password" value={input.confirm_password} onChange={onChange} placeholder="Confirm Password" className="w-full px-3 py-2 border border-gray-300 rounded" />
					<p className={`mt-1 text-sm text-red-500 ${errors.confirm_password ? "visible" : "invisible"}`}>{errors.confirm_password}!</p>
				</div>
				<div className="flex items-center justify-between">
					<Button type="button" color="secondary" onClick={() => navigate("/")}>
						Log In
					</Button>
					<Button type="submit" disabled={submitting} color="primary">
						{submitting ? "Registering..." : "Register"} {/* TODO: LOADING */}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
