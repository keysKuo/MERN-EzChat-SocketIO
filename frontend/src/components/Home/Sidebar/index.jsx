import React, { useEffect, useState } from "react";
import { LuMoreVertical, LuSearch } from "react-icons/lu";
import ChatInfo from "./ChatInfo";
import OnlineUsers from "./OnlineUsers";
import debounce from "lodash/debounce";
import { useAPI } from "../../../hooks";
import configDev from "../../../configs/config.dev";
import { useAuthContext } from "../../../contexts/AuthProvider";
import classNames from "classnames";

export default function Sidebar({
	conversations,
	selectedIndex,
	setSelectedIndex,
	setConversations,
}) {
	// Contexts
	const { user } = useAuthContext();

	// Hooks
	const [searchValue, setSearchValue] = useState("");
	const { fetch, loading, error } = useAPI();
	
	// Effects

	// Handlers
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
				[metaConversation._id]: metaConversation,
			});
			setSelectedIndex(metaConversation?._id);
			// setSelectedIndex(metaConversation.partner._id)
		}
	};

	const onPressEnter = (e) => {
		if (e.key === "Enter") {
			onSearch();
		}
	};

	const onChangeInput = (e) => {
		setSearchValue(e.target.value);
	};

	// Utils
	const clearInput = () => {
		setSearchValue("");
	};

	return (
		<>
			{error && (
				<div
					className={classNames({
						"px-6 py-3 mt-2 text-center text-sm bg-red-400 text-white rounded-lg ": true,
						"absolute top-16 left-[50%] translate-x-[-50%] opacity-90": true,
					})}
				>
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
				<OnlineUsers users={[]} />
			</div>

			{/* SEARCH INPUT */}
			<div className="relative flex items-center justify-start w-[100%] text-gray-500 my-3">
				<input
					type="text"
					placeholder="Search or start new chat"
					className="px-10 py-2 rounded-badge focus:outline-0 w-full bg-[#E8ECEF] text-sm max-w-[100%] truncate"
					value={searchValue}
					onChange={onChangeInput}
					onKeyDown={onPressEnter}
				/>

				<LuSearch size={17} className="absolute ml-3" />
				<span className="absolute right-4 loading loading-sm"></span>
			</div>

			{/* COVERSATIONS LIST */}
			<div className="chat-list flex flex-col item-center justify-between w-full gap-3 overflow-y-scroll">
				<div className="flex flex-col items-start justify-center w-full gap-2">
					{conversations?.map((conv, idx) => {
						return (
							<ChatInfo
								key={idx}
								active={conv._id === selectedIndex}
								conversation={conv}
								onClick={() => {
									setSelectedIndex(conv._id);
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
