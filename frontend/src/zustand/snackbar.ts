import { create } from "zustand";

type SnackbarType = "success" | "info" | "error";

type SnackbarStore = {
	open: boolean;
	message: string;
	type: SnackbarType;
	openSuccessSnackbar: (message: string) => void;
	openInfoSnackbar: (message: string) => void;
	openErrorSnackbar: (message: string) => void;
	closeSnackbar: () => void;
};

export const useSnackbarStore = create<SnackbarStore>((set) => ({
	open: false,
	message: "",
	type: "success",

	openSuccessSnackbar: (message: string) =>
		set({
			open: true,
			message,
			type: "success",
		}),

	openInfoSnackbar: (message: string) =>
		set({
			open: true,
			message,
			type: "info",
		}),

	openErrorSnackbar: (message: string) =>
		set({
			open: true,
			message,
			type: "error",
		}),

	closeSnackbar: () =>
		set({
			open: false,
			message: "",
			type: "success",
		}),
}));
