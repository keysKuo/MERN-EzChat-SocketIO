import React, { useEffect, useRef, useState } from "react";
import {
	LuLogOut,
	LuMoreHorizontal,
	LuPhone,
	LuSend,
	LuSmile,
	LuVideo,
} from "react-icons/lu";
import Message from "./Message";
import { useAPI } from "../../../hooks";
import configDev from "../../../configs/config.dev";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { useSocketContext } from "../../../contexts/SocketProvider";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import classNames from "classnames";

export default function MessageBox({
	conversations, selectedIndex, setSelectedIndex, setConversations,
}) {
	// Contexts
	const { user, setUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();

	// Hooks
	const [input, setInput] = useState("");
	const [visiblePicker, setVisiblePicker] = useState(false);
	const chatBoxRef = useRef(null);
	const { fetch, loading, error } = useAPI();

	// Assigns
	const chatStatus = "online";

	// Effects
	// Tự cuộn xuống cuối mỗi khi messages thay đổi
	useEffect(() => {
		scrollToBottom();
	}, [conversations, selectedIndex]);

	// Handlers
	const onChangeInput = (e) => {
		setInput(e.target.value);
	};

	const onPressEnter = (e) => {
		if (e.key === "Enter") {
			onSendMessage();
		}
	};

	const onSendMessage = async () => {
		if (input === "") {
			return;
		}

		const options = {
			url:
				configDev.API_URL +
				`/messages/send/${conversations[selectedIndex]?.partner?._id}`,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-client-id": user._id,
			},
			data: {
				message: input,
				conversationId: selectedIndex,
			},
			withCredentials: true,
		};

		clearInput();
		const result = await fetch(options);
		if (result) {
			const newMessage = result.metadata;
			let updatedConversations = JSON.parse(
				JSON.stringify(conversations)
			);
			updatedConversations[selectedIndex].messages.push(newMessage);
			setConversations({ ...updatedConversations });
		}
	};

	// Utils
	const scrollToBottom = () => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	};

	const clearInput = () => {
		setInput("");
		setVisiblePicker(false);
	};

	return (
		<>
			{/* HEADER */}
			<div className="chatbox-header w-full flex items-center justify-between bg-[#F5F6F6] px-4 py-2 mb-5">
				<div className="flex items-center justify-center gap-2">
					<div className={`avatar ${chatStatus}`}>
						<div className="w-12 rounded-full">
							<img
								src={conversations[selectedIndex]?.participants[0]?.avatar}
							/>
						</div>
					</div>

					<div className="flex flex-col items-start justify-center">
						<span className="font-bold">
							{conversations[selectedIndex]?.participants[0]?.username}
						</span>
						<span className="text-xs text-gray-400">
							${chatStatus}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-center gap-3">
					<div className="p-2 rounded-full hover:bg-[#E8ECEF] cursor-pointer ">
						<LuVideo size={20} />
					</div>
					<div className="p-2 rounded-full hover:bg-[#E8ECEF] cursor-pointer ">
						<LuPhone size={18} />
					</div>
					<div className="p-2 rounded-full hover:bg-[#E8ECEF] cursor-pointer ">
						<LuMoreHorizontal size={20} />
					</div>
					<div
						onClick={() => {
							setSelectedIndex(null);
						}}
						className="p-2 rounded-full hover:bg-[#E8ECEF] text-red-400 cursor-pointer "
					>
						<LuLogOut size={20} />
					</div>
				</div>
			</div>

			{/* CONVERSATION'S MESSAGES */}
			<div
				ref={chatBoxRef}
				className="chatbox-content overflow-y-scroll overflow-x-hidden w-full flex flex-1 flex-col items-start justify-between 2xl:px-5 px-7 py-2"
			>
				<div className="w-full flex flex-col items-start justify-between">
					{conversations[selectedIndex]?.messages?.map(
						(chat, idx) => {
							const nextChat =
								conversations[selectedIndex].messages[idx + 1];
							const elapseTime =
								Math.abs(
									new Date(nextChat?.createdAt) -
										new Date(chat.createdAt)
								) / 1000;
							const isHiddenTime =
								!(nextChat?.sender !== chat?.sender) &&
								elapseTime < 180;

							return (
								<Message
									key={idx}
									type={
										chat.sender == user._id
											? "right"
											: "left"
									}
									message={chat.message}
									createdAt={chat.createdAt}
									hiddenTime={isHiddenTime}
									shouldShake={chat.shouldShake}
								/>
							);
						}
					)}
				</div>
			</div>

			{/* MESSAGE INPUT */}
			<div className="chatbox-input w-full flex items-center justify-between px-5 py-2 gap-3">
				{/* TEXT INPUT */}
				<div className="relative flex items-center justify-start w-[100%] text-gray-500 my-3">
					<input
						type="text"
						placeholder="Type a message"
						className="px-14 py-3 rounded-badge focus:outline-0 w-full bg-[#F5F6F6] text-base shadow-messagebox"
						value={input}
						onChange={onChangeInput}
						onKeyDown={onPressEnter}
					/>

					<div
						className={classNames({
							hidden: !visiblePicker,
							"fixed z-[100] bottom-[24dvh]": visiblePicker,
						})}
					>
						<Picker
							data={data}
							previewPosition="none"
							onEmojiSelect={(e) => {
								setInput((prev) => prev + e.native);
								setVisiblePicker((prev) => !prev);
							}}
							theme={"light"}
						/>
					</div>

					<LuSmile
						onClick={() => {
							setVisiblePicker((prev) => !prev);
						}}
						size={26}
						className="absolute ml-4 cursor-pointer"
					/>

					{/* SEND BuTTON */}
					<button
						disabled={loading}
						onClick={onSendMessage}
						className="absolute right-2 flex items-center justify-center p-3 cursor-pointer"
					>
						{loading ? (
							<span className="loading loading-bars loading-sm"></span>
						) : (
							<LuSend size={22} />
						)}
					</button>
				</div>
			</div>
		</>
	);
}
