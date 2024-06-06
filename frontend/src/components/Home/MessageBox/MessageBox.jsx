import React, { useLayoutEffect, useRef } from "react";
import {
	LuMoreHorizontal,
	LuPhone,
	LuSendHorizonal,
	LuSmile,
	LuVideo,
} from "react-icons/lu";
import Message from "./Message";

export default function MessageBox({ conversation }) {
	const chatBoxRef = useRef(null);

	// Tự cuộn xuống cuối mỗi khi messages thay đổi
	useLayoutEffect(() => {
		scrollToBottom();
	}, []);

	// Hàm cuộn xuống cuối
	const scrollToBottom = () => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	};

	return (
		<>
			{/* HEADER */}
			<div className="chatbox-header w-full flex items-center justify-between bg-[#F5F6F6] px-4 py-2 mb-5">
				<div className="flex items-center justify-center gap-2">
					<div className={`avatar ${conversation?.partner?.status}`}>
						<div className="w-12 rounded-full">
							<img
								src={
									conversation?.partner?.avatar ||
									"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
								}
							/>
						</div>
					</div>

					<div className="flex flex-col items-start justify-center">
						<span className="font-bold">{conversation?.partner?.username}</span>
						<span className="text-xs text-gray-400">{conversation?.partner?.status}</span>
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
				</div>
			</div>

			{/* CONVERSATION'S MESSAGES */}
			<div
				ref={chatBoxRef}
				className="chatbox-content overflow-scroll w-full flex flex-1 flex-col items-start justify-between px-5 py-2"
			>
				<div className="w-full flex flex-col items-start justify-between">
					{conversation?.messages.map((chat, idx) => {
						const nextChat = conversation?.messages[idx + 1];
						const isHiddenTime =
							!(nextChat?.userId !== chat?.userId) &&
							new Date(nextChat?.createdAt).getTime() -
								new Date(chat.createdAt).getTime() <
								60;

						return (
							<Message
								key={idx}
								type={chat.userId == 2 ? "right" : "left"}
								message={chat.message}
								createdAt={chat.createdAt}
								hiddenTime={isHiddenTime}
							/>
						);
					})}
				</div>
			</div>

			{/* MESSAGE INPUT */}
			<div className="chatbox-input w-full flex items-center justify-between px-5 py-2 gap-3">
				{/* TEXT INPUT */}
				<div className="flex items-center justify-start w-[90%] text-gray-500 my-3">
					<input
						type="text"
						placeholder="Type a message"
						className="px-14 py-3 rounded-badge focus:outline-0 w-full bg-[#F5F6F6] text-base shadow-messagebox"
					/>

					<LuSmile
						size={26}
						className="absolute ml-4 cursor-pointer"
					/>
				</div>

				{/* SEND BuTTON */}
				<div className="flex items-center justify-center p-3 rounded-full bg-[#ccc] cursor-pointer">
					<LuSendHorizonal size={22} />
				</div>
			</div>
		</>
	);
}
