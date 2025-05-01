export const capitalizeFirstLetter = (str: string) => {
	return str[0].toUpperCase() + str.slice(1);
};

export const timeout = (delay: number) => {
	return new Promise((res) => setTimeout(res, delay));
};
