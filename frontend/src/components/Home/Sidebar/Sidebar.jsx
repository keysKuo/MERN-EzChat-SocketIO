import React, { useEffect, useState } from "react";
import { LuMoreVertical, LuSearch } from "react-icons/lu";
import ChatInfo from "./ChatInfo";
import OnlineUsers from "./OnlineUsers";
import debounce from "lodash/debounce";
import { useAPI } from "../../../hooks";
import configDev from "../../../configs/config.dev";
import { useAuthContext } from "../../../contexts/AuthProvider";

export default function Sidebar({
	conversations,
	selectedIndex,
	setSelectedIndex,
	setConversations,
}) {
	const [searchValue, setSearchValue] = useState("");
	const { fetch, loading, error } = useAPI();
	const { user } = useAuthContext();


	const onSearch = async () => {
		const options = {
			url: configDev.API_URL + `/messages/setup`,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-client-id": user._id,
			},
			data: {
				email: searchValue,
			},
			withCredentials: true,
		};

		clearInput();
		const result = await fetch(options);
		if (result) {
			const metaConversation = result.metadata;
			// console.log(metaConversation);

			setConversations({
				...conversations,
				[metaConversation._id]: metaConversation
			});
			setSelectedIndex(metaConversation?._id)
			// setSelectedIndex(metaConversation.partner._id)
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			onSearch();
		}
	};

	const handleChangeInput = (e) => {
		setSearchValue(e.target.value);
	};

	const clearInput = () => {
		setSearchValue("");
	};

	return (
		<>
			{error && (
				<div className="absolute top-16 left-[50%] translate-x-[-50%] px-6 py-3 mt-2 text-center text-sm bg-red-400 text-white rounded-lg opacity-90">
					{error}
				</div>
			)}
			{/* HEADER */}
			<div className="flex items-center justify-between w-full">
				<span className="text-[1.05rem]">Active Users</span>
				<LuMoreVertical size={20} className="translate-x-[30%]" />
			</div>

			{/* ONLINE USERS LIST */}
			<div className="flex items-center justify-start gap-4">
				<OnlineUsers
					users={Object.entries(conversations)?.map(
						([key, conv]) => conv.partner
					)}
				/>
			</div>

			{/* SEARCH INPUT */}
			<div className="flex items-center justify-start w-[100%] text-gray-500 my-3">
				<input
					type="text"
					placeholder="Search or start new chat"
					className="px-10 py-2 rounded-badge focus:outline-0 w-full bg-[#E8ECEF] text-sm max-w-[100%] truncate"
					value={searchValue}
					onChange={handleChangeInput}
					onKeyDown={handleKeyDown}
				/>

				<LuSearch size={17} className="absolute ml-3" />
			</div>

			{/* COVERSATIONS LIST */}
			<div className="chat-list flex flex-col item-center justify-between w-full gap-3 overflow-y-scroll">

				<div className="flex flex-col items-start justify-center w-full gap-2">
					{Object.entries(conversations)?.map(([key, conv]) => {
						return (
							<ChatInfo
								key={key}
								active={key === selectedIndex}
								conversation={conv}
								onClick={() => {
									setSelectedIndex(key);
								}}
								shouldShake={conv.shouldShake}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}
