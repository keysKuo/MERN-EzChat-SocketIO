import React, { useContext, useEffect, useState } from "react";

import MessageBox from "../components/Home/MessageBox/MessageBox";
import Sidebar from "../components/Home/Sidebar/Sidebar";
import ContactInfo from "../components/Home/ContactInfo/ContactInfo";
import { useNavigate } from "react-router-dom";
import configDev from "../configs/config.dev";
import { useAPI } from "../hooks";
import { useAuthContext } from "../contexts/AuthProvider";

export default function HomePage() {
	const [selectedIndex, setSelectedIndex] = useState(null);
	// localStorage.clear();
	const { user, setUser } = useAuthContext();
	const { fetch, loading, error } = useAPI();
	const [conversations, setConversations] = useState([]);
	
	useEffect(() => {
		const LoadConversations = async () => {
			const options = {
				url: configDev.API_URL + `/users/history`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-client-id": user._id,
				},
				withCredentials: true,
			};

			const result = await fetch(options);
			if (result) {
				setConversations(result?.metadata);
			}
			// console.log(error)
		};

		LoadConversations();
	}, [setConversations]);

	return (
		<>
			{loading ? (
				<>
					<span className="loading loading-infinity w-52 text-primary"></span>
				</>
			) : (
				<div className="flex sm:flex-row flex-col items-center justify-between h-[60dvh] w-[80%]">
					{/* ACTIVE USERS SIDEBAR */}
					<div
						className="xl:w-[30%] sm:w-[40%] w-[100%] min-h-[60dvh] 
                    max-h-[60dvh] flex flex-col items-start justify-start p-8 bg-[#F5F6F6] shadow-messagebox gap-4"
					>
						<Sidebar
							conversations={conversations}
							selectedIndex={selectedIndex}
							setSelectedIndex={setSelectedIndex}
						/>
					</div>

					{selectedIndex === null ? (
						<>
							<div className="2xl:w-[70%] sm:w-[80%] min-h-[60dvh] max-h-[60dvh] flex flex-col items-center justify-center shadow-messagebox">
								<img
									className="w-72"
									src="/logo_2.png"
									alt=""
								/>
							</div>
						</>
					) : (
						<>
							{/* CHATBOX MESSAGES */}
							<div className="2xl:w-[47%] sm:w-[80%] min-h-[60dvh] max-h-[60dvh] flex flex-col items-center justify-center shadow-messagebox">
								<MessageBox
									conversation={conversations[selectedIndex]}
								/>
							</div>

							{/* USER CONTACT INFORMATION */}
							<div className="w-[20%] min-h-[60dvh] max-h-[60dvh] 2xl:flex hidden flex-col items-center justify-start p-6 bg-[#F8F9FA] shadow-messagebox">
								<ContactInfo
									conversation={conversations[selectedIndex]}
								/>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
}
