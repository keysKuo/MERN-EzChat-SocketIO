import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import { io } from "socket.io-client";
import configDev from "../configs/config.dev";

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export default function SocketProvider({ children }) {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user } = useAuthContext();

	useEffect(() => {
		if (user) {
			const socket = io(configDev.SOCKET_URL, {
				path: "/socket",
				query: {
					userId: user._id,
				},
			});

			setSocket(socket);
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [user]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
}
