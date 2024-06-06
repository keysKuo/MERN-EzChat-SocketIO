import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const jsonUser = localStorage.getItem("user");
		return JSON.parse(jsonUser) || null;
	});
	
	useEffect(() => {
		if (!user) {
			setUser(null);
			localStorage.clear();
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
}
