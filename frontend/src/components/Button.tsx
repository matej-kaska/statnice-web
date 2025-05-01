type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode;
	color?: "primary" | "secondary" | "blue";
	className?: string;
	type?: "button" | "submit" | "reset";
	box?: boolean;
};

const Button = ({ children, color = "primary", type = "button", className, box, ...props }: ButtonProps) => {
	const colors = {
		primary: "bg-accent text-white px-4 py-2 rounded hover:brightness-95 disabled:opacity-50",
		secondary: "bg-second text-white px-4 py-2 rounded hover:brightness-95",
		blue: "bg-main text-white px-4 py-2 rounded hover:brightness-95 disabled:opacity-50",
	};

	return (
		<button
			className={`
      ${box ? "py-1" : "px-3"} font-medium focus:outline-none disabled:cursor-not-allowed disabled:grayscale disabled:brightness-75 cursor-pointer
      ${colors[color]} ${className ? className : ""}`}
			{...props}
			type={type}
		>
			{children && children}
		</button>
	);
};

export default Button;
