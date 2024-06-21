import "./App.css";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";

import { ClientRoot } from "./layouts";
import { HomePage, SignInPage, SignUpPage } from "./pages";
import { useAuthContext } from "./contexts/AuthProvider";
import ChartPage from "./pages/Chart";

function App() {
	const { user, setUser } = useAuthContext();

	return (
		<RouterProvider router={createBrowserRouter([
			{
				path: "/",
				element: <ClientRoot />,
				children: [
					{ path: "/", element: user ? <HomePage /> : <Navigate to='/login' /> },
					{ path: "/login", element: user ? <Navigate to="/" /> : <SignInPage /> },
					{ path: "/register", element: user ? <Navigate  to="/" /> : <SignUpPage /> },
					{ path: "/chart", element: <ChartPage /> },
				],
			},
		])} />
	);
}

export default App;
