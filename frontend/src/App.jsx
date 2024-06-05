import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ClientRoot } from "./layouts";
import { HomePage, SignInPage, SignUpPage } from "./pages";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ClientRoot />,
		children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/login", element: <SignInPage /> },
			{ path: "/signUp", element: <SignUpPage /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
