import ErrorIcon from "images/snackbar-error.svg?react";
import InfoIcon from "images/snackbar-info.svg?react";
import SuccessIcon from "images/snackbar-ok.svg?react";

export type SnackbarType = "success" | "info" | "error";

type SnackbarProps = {
	message: string;
	type: SnackbarType;
	fade: "fade-in" | "fade-out";
	closeSnackbar: () => void;
};

const Snackbar = ({ message, type, fade, closeSnackbar }: SnackbarProps) => {
	const wrapperClasses = ["fixed top-4 left-1/2 z-150 transform -translate-x-1/2", "transition-opacity duration-300 ease-in-out", fade === "fade-in" ? "opacity-100" : "opacity-0"].filter(Boolean).join(" ");

	const containerClasses = ["inline-flex items-center px-4 py-2 rounded-md shadow-md border-t-4", type === "success" ? "bg-green-100 border-green-500" : type === "error" ? "bg-red-100 border-red-500" : "bg-blue-100 border-blue-500"].filter(Boolean).join(" ");

	const Icon = type === "success" ? SuccessIcon : type === "error" ? ErrorIcon : InfoIcon;

	return (
		<div className={wrapperClasses} onClick={closeSnackbar} tabIndex={0} role="alert">
			<div className={containerClasses}>
				<Icon className="w-5 h-5 mr-3 flex-shrink-0" />
				<p className="select-none font-semibold text-base text-black">{message}</p>
			</div>
		</div>
	);
};

export default Snackbar;
