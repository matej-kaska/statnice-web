import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserInfo = {
	email: string;
	role: "admin" | "user" | "analytic";
	first_name: string;
	last_name: string;
	token: string;
};

type UserInfoState = {
	userInfo: UserInfo;
	setUserInfo: (info: UserInfo) => void;
	clearUserInfo: () => void;
};

const initialUserInfo: UserInfo = {
	email: "",
	role: "user",
	first_name: "",
	last_name: "",
	token: "",
};

const useUserInfoStore = create<UserInfoState>()(
	persist(
		(set) => ({
			userInfo: initialUserInfo,
			setUserInfo: (userInfo) => set({ userInfo }),
			clearUserInfo: () => set({ userInfo: initialUserInfo }),
		}),
		{
			name: "user-info",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ userInfo: state.userInfo }),
		},
	),
);

export default useUserInfoStore;
