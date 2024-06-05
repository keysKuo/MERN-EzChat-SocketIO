import React from "react";
import { Outlet } from "react-router-dom";

export default function ClientRoot() {
	return (
		<>
			<main className="main p-4 min-h-screen text-zinc-700 font-medium flex items-center justify-center">
				<Outlet />
			</main>
		</>
	);
}
