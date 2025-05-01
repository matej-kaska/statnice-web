import Button from "@/components/Button";
import { websiteUrl } from "@/utils/consts";
import { useState } from "react";
import axiosRequest from "utils/axios";

type TestResponse = {
	message: string;
};

const Testing = () => {
	const [connection, setConnection] = useState<string>("Check connection to backend...");
	const [connectionSQL, setConnectionSQL] = useState<string>("Check connection to SQL...");

	const checkConnection = async () => {
		const response = await axiosRequest<TestResponse>("GET", "/api/test/connection");
		if (!response.success) {
			setConnection("Error");
			return;
		}
		setConnection(response.data.message);
	};

	const checkConnectionSQL = async () => {
		const response = await axiosRequest<TestResponse>("GET", "/api/test/sql");
		if (!response.success) {
			setConnectionSQL("Error");
			return;
		}
		setConnectionSQL(response.data.message);
	};

	return (
		<div className="flex items-center justify-center w-full">
			<title>BasicERP | Testing</title>
			<meta
				name="description"
				content="BasicERP testing environment: experiment with new features, integrations, and API endpoints."
			/>
			<link rel="canonical" href={`${websiteUrl}/testing`} />
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="flex flex-col items-center justify-center">
					<h2>{connection}</h2>
					<Button onClick={checkConnection}>Check</Button>
				</div>
				<div className="flex flex-col items-center justify-center">
					<h2>{connectionSQL}</h2>
					<Button onClick={checkConnectionSQL}>Check</Button>
				</div>
			</div>
		</div>
	);
};

export default Testing;
