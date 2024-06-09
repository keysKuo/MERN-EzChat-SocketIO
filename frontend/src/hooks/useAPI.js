import axios from "axios";
import { useState } from "react";

export default function useAPI() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetch = async (options) => {
		if (options.data) {
			var err = "";
			Object.entries(options.data).forEach(([key, value]) => {
				if (!value || value == "") {
					err = "Error occured!";
				}
			});

			if (err) {
				setError(err);
				return null;
			}
		}

		setLoading(true);
		return await axios
			.request(options)
			.then((response) => response.data)
			.then((result) => (result?.success ? result : null))
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data?.message || "Error occured!");
				return null;
			})
			.finally(() => {
				setTimeout(() => {
					setLoading(false);
					setError(null);
				}, 1000);
			});
	};

	return { fetch, loading, error };
}
