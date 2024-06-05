import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Common/Header";

export default function ClientRoot() {
	return (
		<>
            <Header />
			<main className="main p-4 min-h-screen text-zinc-700 font-medium flex items-center justify-center">
				<Outlet />
			</main>
		</>
	);
}
