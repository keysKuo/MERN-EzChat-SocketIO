import React, { useState } from "react";

import MessageBox from "../components/Home/MessageBox/MessageBox";
import Sidebar from "../components/Home/Sidebar/Sidebar";
import ContactInfo from "../components/Home/ContactInfo/ContactInfo";

let fakeChat_1 = [
	{
		userId: 1,
		message: "Hi there, how are you ?",
		createdAt: `2024-06-04T12:10:54.440+00:00`,
	},
	{
		userId: 2,
		message: `Good, What's up Bro ?`,
		createdAt: `2024-06-04T15:10:54.440+00:00`,
	},
	{
		userId: 2,
		message: "Hangout tonight ?",
		createdAt: `2024-06-04T15:10:54.440+00:00`,
	},
	{
		userId: 1,
		message: "Sure, What time?",
		createdAt: `2024-06-04T15:10:54.440+00:00`,
	},
];

let fakeChat_2 = [
	{
		userId: 2,
		message: "Will you go to my party ?",
		createdAt: `2024-06-04T12:10:54.440+00:00`,
	},
	{
		userId: 3,
		message: `I don't know, will you?`,
		createdAt: `2024-06-04T15:10:54.440+00:00`,
	},
];

let fakeConversations = [
	{
		partner: {
			userId: "1",
			username: "Kryo Kuo",
			avatar: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
			status: "online",
		},
		lastMessage: {
			message: `Sure, What time?`,
			createdAt: `2024-06-04T15:10:54.440+00:00`,
		},
		messages: fakeChat_1,
	},
	{
		partner: {
			userId: "3",
			username: "Serena Irr",
			avatar: "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg",
			status: "offline",
		},
		lastMessage: {
			message: `I don't know, will you?`,
			createdAt: `2024-06-04T17:10:54.440+00:00`,
		},
		messages: fakeChat_2,
	},
];

export default function HomePage() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<>
			<div className="flex sm:flex-row flex-col items-center justify-between h-[60dvh] w-[80%]">
				{/* ACTIVE USERS SIDEBAR */}
				<div
					className="xl:w-[30%] sm:w-[40%] w-[100%] min-h-[60dvh] 
                    max-h-[60dvh] flex flex-col items-start justify-start p-8 bg-[#F5F6F6] shadow-messagebox gap-4"
				>
					<Sidebar
						conversations={fakeConversations}
						selectedIndex={selectedIndex}
						setSelectedIndex={setSelectedIndex}
					/>
				</div>

				{/* CHATBOX MESSAGES */}
				<div className="2xl:w-[47%] sm:w-[80%] min-h-[60dvh] max-h-[60dvh] flex flex-col items-center justify-center shadow-messagebox">
					<MessageBox
						conversation={fakeConversations[selectedIndex]}
					/>
				</div>

				{/* USER CONTACT INFORMATION */}
				<div className="w-[20%] min-h-[60dvh] max-h-[60dvh] 2xl:flex hidden flex-col items-center justify-start p-6 bg-[#F8F9FA] shadow-messagebox">
                    <ContactInfo conversation={fakeConversations[selectedIndex]} />
                </div>
			</div>
		</>
	);
}
