import React, { useEffect, useRef, useState } from "react";
import {
	LuArrowBigLeft,
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

const chartData = [
	{ date: new Date(2023, 0, 1), value: 30 },
	{ date: new Date(2023, 1, 1), value: 40 },
	{ date: new Date(2023, 2, 1), value: 35 },
	{ date: new Date(2023, 3, 1), value: 50 },
	{ date: new Date(2023, 4, 1), value: 55 },
	{ date: new Date(2023, 5, 1), value: 80 },
	{ date: new Date(2023, 6, 1), value: 160 },
	{ date: new Date(2023, 7, 1), value: 20 },
	{ date: new Date(2023, 8, 1), value: 90 },
	{ date: new Date(2023, 9, 1), value: 120 },
	{ date: new Date(2023, 10, 1), value: 50 },
  ];


export default function MessageBox({
	conversations,
	selectedIndex,
	setSelectedIndex,
	setConversations,
}) {
	const chatBoxRef = useRef(null);
	const { user, setUser } = useAuthContext();
	const { fetch, loading, error } = useAPI();
	const [input, setInput] = useState("");
	const { onlineUsers } = useSocketContext();
	const userStatus = onlineUsers.includes(
		conversations[selectedIndex]?.partner?._id
	)
		? "online"
		: "offline";
	const [visiblePicker, setVisiblePicker] = useState(false);
	const [langMess, setLangMess] = useState([]);
	// useEffect(() => {

	// }, [conversations, selectedIndex, setConversations, setSelectedIndex])

	// Tự cuộn xuống cuối mỗi khi messages thay đổi
	useEffect(() => {
		scrollToBottom();
	}, [conversations, selectedIndex, langMess]);

	// Hàm cuộn xuống cuối
	const scrollToBottom = () => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	};

	const handleChangeInput = (e) => {
		setInput(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			onSendMessage();
		}
	};

	const onSendMessage = async () => {
		if (input === "") {
			return;
		}

		const myMessage = {
			type: "right",
			message: input,
		};
		const updatedLangMess = [...langMess];
		updatedLangMess.push(myMessage);
		setLangMess([...updatedLangMess]);

		const options = {
			url: configDev.API_URL + "/langchain/test",
			// `/messages/send/${conversations[selectedIndex]?.partner?._id}`,
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
			updatedLangMess.push({
				type: "left",
				message: newMessage,
				chartData: chartData
			});
			setLangMess([...updatedLangMess]);
			// let updatedConversations = JSON.parse(
			// 	JSON.stringify(conversations)
			// );
			// updatedConversations[selectedIndex].messages.push(newMessage);
			// setConversations({ ...updatedConversations });
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
					<div className={`avatar ${userStatus}`}>
						<div className="w-12 rounded-full">
							<img
								src={
									conversations[selectedIndex]?.partner
										?.avatar
								}
							/>
						</div>
					</div>

					<div className="flex flex-col items-start justify-center">
						<span className="font-bold">
							{conversations[selectedIndex]?.partner?.username}
						</span>
						<span className="text-xs text-gray-400">
							${userStatus}
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
					{/* {conversations[selectedIndex]?.messages?.map(
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
					)} */}

					{langMess?.map((lm, idx) => {
						return (
							<Message
								key={idx}
								type={lm.type}
								message={lm.message}
								createdAt={new Date().toISOString()}
								chartData={lm.chartData}
							/>
						);
					})}
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
						onChange={handleChangeInput}
						onKeyDown={handleKeyDown}
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
