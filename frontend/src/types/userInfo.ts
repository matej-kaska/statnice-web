export type TUserInfo = {
	id: number | undefined;
	email: string | undefined;
	role: "user" | "analytic" | "admin";
	first_name: string | undefined;
	last_name: string | undefined;
	token: string;
};

export const blankUserInfo: TUserInfo = {
	id: undefined,
	email: undefined,
	role: "user",
	first_name: undefined,
	last_name: undefined,
	token: "",
};
