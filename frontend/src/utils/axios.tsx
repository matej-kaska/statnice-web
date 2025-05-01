import useUserInfoStore from "@/zustand/userInfo";
import axios, { AxiosHeaders, type AxiosError, type AxiosRequestConfig } from "axios";

const { getState } = useUserInfoStore;

const instance = axios.create();

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status;
		if (status === 401) {
			getState().clearUserInfo();
			console.warn("You must be logged in to perform this action!");
		}
		return Promise.reject(error);
	},
);

instance.interceptors.request.use(
	(config) => {
		const token = getState().userInfo.token;
		if (token) {
			const headers = new AxiosHeaders(config.headers);
			headers.set("Authorization", `Token ${token}`);
			config.headers = headers;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

type SuccessResponse<T> = {
	success: true;
	status: number;
	data: T;
};

type ErrorResponse = {
	success: false;
	status: number;
	message: string;
};

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const isValidErrorData = (value: any): value is string => {
	return value != null && typeof value === "string";
};

const axiosRequest = async <T,>(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", url: string, data?: any, config: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
	try {
		const response = await instance.request<T>({
			...config,
			method,
			url,
			data,
		});
		return {
			success: true,
			status: response.status,
			data: response.data,
		};
	} catch (err) {
		const axiosError = err as AxiosError;
		const responseData = axiosError.response?.data as any;
		const message = isValidErrorData(responseData.message) ? responseData.message : "An unexpected error occurred";

		return {
			success: false,
			status: axiosError.response?.status ?? 500,
			message,
		};
	}
};

export const clearAxiosAuthorization = () => {
	instance.defaults.headers.common.Authorization = undefined;
};

export default axiosRequest;
