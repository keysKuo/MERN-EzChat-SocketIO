import React, { useContext, useEffect, useState } from "react";

import MessageBox from "../components/Home/MessageBox/MessageBox";
import Sidebar from "../components/Home/Sidebar/Sidebar";
import ContactInfo from "../components/Home/ContactInfo/ContactInfo";
import configDev from "../configs/config.dev";
import { useAPI } from "../hooks";
import { useAuthContext } from "../contexts/AuthProvider";
import { useSocketContext } from "../contexts/SocketProvider";
import notificationSound from "../assets/notification.mp3";
import classNames from "classnames";

export default function HomePage() {
	// Contexts
	const { user, setUser } = useAuthContext();
	const { socket, onlineUsers } = useSocketContext();

	// States
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [conversations, setConversations] = useState({});

	// Hooks
	const { fetch, loading, error } = useAPI();

	useEffect(() => {
		// Load Conversations History from Backend
		const LoadConversations = async () => {
			const options = {
				url: configDev.API_URL + `/users/history_v2`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-client-id": user._id,
				},
				withCredentials: true,
			};

			const result = await fetch(options);
			if (result) {
				// console.log(result);
				setConversations({ ...result?.metadata });
			}
			// console.log(error)
		};
		LoadConversations();
	}, []);

	// Listen Send message
	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			let updatedConversations = JSON.parse(
				JSON.stringify(conversations)
			);
			updatedConversations[newMessage.conversation].messages.push(
				newMessage
			);
			setConversations({ ...updatedConversations });
		});

		socket?.on("newConversation", (newConversation) => {
			newConversation.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			setConversations({
				...conversations,
				[newConversation._id]: {
					...newConversation,
					partner: newConversation.participants.find(
						(p) =>
							p._id.toString() !==
							newConversation.partner._id.toString()
					),
				},
			});
		});

		return () => {
			socket?.off("newMessage");
			socket?.off("newConversation");
		};
	}, [socket, conversations, setConversations]);

	return (
		<>
			{/* {loading ? (
				<>
					<span className="loading loading-infinity w-52 text-primary"></span>
				</>
			) : (
				
			)} */}
			<div className="flex sm:flex-row flex-col items-center justify-between h-[60dvh] lg:w-[80%] w-[100%]">
				{/* ACTIVE USERS SIDEBAR */}
				<div
					className={classNames({
						"xl:w-[30%] sm:w-[40%] w-[100%] min-h-[70dvh] max-h-[70dvh] p-8 bg-[#F5F6F6] shadow-messagebox ": true,
						"flex flex-col items-start justify-start gap-4": true,
						"sm:flex hidden": selectedIndex,
					})}
				>
					<Sidebar
						conversations={conversations}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
						setConversations={setConversations}
					/>
				</div>

				{selectedIndex === null ? (
					<>
						<div className="2xl:w-[70%] sm:w-[80%] min-h-[70dvh] max-h-[70dvh] sm:flex hidden flex-col items-center justify-center shadow-messagebox">
							<img className="w-72" src="/logo_2.png" alt="" />
						</div>
					</>
				) : (
					<>
						{/* CHATBOX MESSAGES */}
						<div
							className={classNames({
								"2xl:w-[47%] sm:w-[80%] w-[100%] min-h-[70dvh] max-h-[70dvh] shadow-messagebox": true,
								"flex flex-col items-center justify-center": true,
								hidden: !selectedIndex,
							})}
						>
							<MessageBox
								conversations={conversations}
								selectedIndex={selectedIndex}
								setConversations={setConversations}
								setSelectedIndex={setSelectedIndex}
							/>
						</div>

						{/* USER CONTACT INFORMATION */}
						<div className="w-[20%] min-h-[70dvh] max-h-[70dvh] 2xl:flex hidden flex-col items-center justify-start p-6 bg-[#F8F9FA] shadow-messagebox">
							<ContactInfo
								conversations={conversations}
								selectedIndex={selectedIndex}
								setConversations={setConversations}
							/>
						</div>
					</>
				)}
			</div>
		</>
	);
}
