import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ClientRoot } from "./layouts";
import { HomePage, SignInPage, SignUpPage } from "./pages";
import AuthProvider from "./contexts/AuthProvider";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ClientRoot />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/login", element: <SignInPage /> },
			{ path: "/register", element: <SignUpPage /> },
		],
	},
]);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
