import React, { useEffect, useState } from "react";
import { LuMoreVertical, LuSearch } from "react-icons/lu";
import ChatInfo from "./ChatInfo";
import OnlineUsers from "./OnlineUsers";

export default function Sidebar({ conversations, selectedIndex, setSelectedIndex }) {
	console.log(conversations)
	return (
		<>
			{/* HEADER */}
			<div className="flex items-center justify-between w-full">
				<span className="text-[1.05rem]">Active Users</span>
				<LuMoreVertical size={20} className="translate-x-[30%]" />
			</div>

			{/* ONLINE USERS LIST */}
			<div className="flex items-center justify-start gap-4">
				<OnlineUsers
					users={Object.entries(conversations)?.map(([key, conv]) => conv.partner)}
				/>
			</div>

			{/* SEARCH INPUT */}
			<div className="flex items-center justify-start w-[90%] text-gray-500 my-3">
				<input
					type="text"
					placeholder="Search or start new chat"
					className="px-10 py-2 rounded-badge focus:outline-0 w-full bg-[#E8ECEF] text-sm"
				/>

				<LuSearch size={17} className="absolute ml-3" />
			</div>

			{/* COVERSATIONS LIST */}
			<div className="flex flex-col item-center justify-between w-full gap-3">
				<span className="text-[1rem] px-4">ALL CHATS</span>

				<div className="chat-list flex flex-col items-start justify-center w-full gap-2 overflow-y-scroll">
					{Object.entries(conversations)?.map(([key, conv]) => {
						return (
							<ChatInfo
								key={key}
								active={key === selectedIndex}
								conversation={conv}
								onClick={() => {
									setSelectedIndex(key);
								}}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}
