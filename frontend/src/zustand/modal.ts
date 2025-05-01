import { create } from "zustand";

type ModalStore = {
	modalOpen: boolean;
	modalContent: React.ReactNode;
	showModal: (content: React.ReactNode) => void;
	closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
	modalOpen: false,
	modalContent: null,
	showModal: (content) =>
		set({
			modalOpen: true,
			modalContent: content,
		}),
	closeModal: () =>
		set({
			modalOpen: false,
			modalContent: null,
		}),
}));
