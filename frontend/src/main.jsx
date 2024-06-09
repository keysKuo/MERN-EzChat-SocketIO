import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthProvider.jsx";
import SocketProvider from "./contexts/SocketProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</AuthProvider>
	</React.StrictMode>
);
