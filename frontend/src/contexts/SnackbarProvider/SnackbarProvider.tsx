import { useSnackbarStore } from "@/zustand/snackbar";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import Snackbar from "./Snackbar";

type SnackbarContextType = {
	openSuccessSnackbar: (msg: string) => void;
	openInfoSnackbar: (msg: string) => void;
	openErrorSnackbar: (msg: string) => void;
	closeSnackbar: () => void;
	forceCloseSnackbar: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
	const { open, message, type, openSuccessSnackbar, openInfoSnackbar, openErrorSnackbar, closeSnackbar: closeStoreSnackbar } = useSnackbarStore();

	const [fade, setFade] = useState<"fade-in" | "fade-out">("fade-in");
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	const [firstLoad, setFirstLoad] = useState(true);

	useEffect(() => {
		if (firstLoad) {
			setFirstLoad(false);
			return;
		}
		if (open) {
			setFade("fade-in");
			if (timer) clearTimeout(timer);
			const t = setTimeout(() => {
				setFade("fade-out");
				setTimeout(() => {
					closeStoreSnackbar();
				}, 300);
			}, 4000);
			setTimer(t);
		}
	}, [open]);

	const forceCloseSnackbar = () => {
		if (timer) clearTimeout(timer);
		setFade("fade-out");
		setTimeout(() => {
			closeStoreSnackbar();
		}, 300);
	};

	return (
		<SnackbarContext.Provider
			value={{
				openSuccessSnackbar,
				openInfoSnackbar,
				openErrorSnackbar,
				closeSnackbar: forceCloseSnackbar,
				forceCloseSnackbar,
			}}
		>
			{children}
			{open && <Snackbar message={message} type={type} fade={fade} closeSnackbar={forceCloseSnackbar} />}
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = () => {
	const ctx = useContext(SnackbarContext);
	if (!ctx) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return ctx;
};
