import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
	LuMic,
	LuMoreHorizontal,
	LuMoreVertical,
	LuPhone,
	LuSearch,
	LuSmile,
	LuTrash,
	LuVideo,
} from "react-icons/lu";

export default function HomePage() {
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
			<div className="flex sm:flex-row flex-col items-center justify-between h-[60dvh] w-[80%]">
				{/* ACTIVE USERS */}
				<div
					className="xl:w-[30%] sm:w-[40%] w-[100%] min-h-[60dvh] 
                    max-h-[60dvh] flex flex-col items-start justify-start p-8 bg-[#F5F6F6] shadow-messagebox gap-4"
				>
					{/* HEADER */}
					<div className="flex items-center justify-between w-full">
						<span className="text-[1.05rem]">Active Users</span>
						<LuMoreVertical
							size={20}
							className="translate-x-[30%]"
						/>
					</div>

					{/* ONLINE USERS LIST */}
					<div className="flex items-center justify-start gap-5">
						<div className="avatar online">
							<div className="w-10 rounded-full">
								<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
							</div>
						</div>
						<div className="avatar online">
							<div className="w-10 rounded-full">
								<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
							</div>
						</div>
						<div className="avatar online">
							<div className="w-10 rounded-full">
								<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
							</div>
						</div>
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

						<div className="chat-list flex flex-col items-start justify-center w-full gap-2">
							<div className="chat-item flex items-center justify-between gap-3 w-full bg-[#E8ECEF] px-4 py-2">
								<div className="w-[20%] flex items-center">
									<div className="avatar online">
										<div className="w-12 rounded-full">
											<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
										</div>
									</div>
								</div>

								<div className="w-[80%] flex flex-col items-start justify-center">
									<div className="flex items-center justify-between w-full">
										<span className="font-bold">Hamed</span>
										<span className="text-gray-400 text-xs">
											12:35 PM
										</span>
									</div>

									<div className="max-w-[90%] truncate">
										<span className="text-gray-400 text-sm">
											Thank you very much, I'm wai....
										</span>
									</div>
								</div>
							</div>

							<div className="chat-item flex items-center justify-between gap-3 w-full px-4 py-2">
								<div className="w-[20%] flex items-center">
									<div className="avatar online">
										<div className="w-12 rounded-full">
											<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
										</div>
									</div>
								</div>

								<div className="w-[80%] flex flex-col items-start justify-center">
									<div className="flex items-center justify-between w-full">
										<span className="font-bold">Hamed</span>
										<span className="text-gray-400 text-xs">
											12:35 PM
										</span>
									</div>

									<div className="max-w-[90%] truncate">
										<span className="text-gray-400 text-sm">
											Thank you very much, I'm wai....
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* CHATBOX MESSAGES */}
				<div className="2xl:w-[47%] sm:w-[80%] min-h-[60dvh] max-h-[60dvh] flex flex-col items-center justify-center shadow-messagebox">
					{/* HEADER */}
					<div className="chatbox-header w-full flex items-center justify-between bg-[#F5F6F6] px-4 py-2 mb-5">
						<div className="flex items-center justify-center gap-2">
							<div className="avatar online">
								<div className="w-12 rounded-full">
									<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
								</div>
							</div>

							<div className="flex flex-col items-start justify-center">
								<span className="font-bold">Hamed</span>
								<span className="text-xs text-gray-400">
									Online
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
						</div>
					</div>

					{/* CONVERSATION'S MESSAGES */}
					<div
						ref={chatBoxRef}
						className="chatbox-content overflow-scroll w-full flex flex-1 flex-col items-start justify-between px-5 py-2"
					>
						<div className="w-full flex flex-col items-start justify-between">
							<div className="message-left flex flex-col gap-2 my-2">
								<div className="message rounded-lg px-4 py-2">
									Hi there, How are you ?
								</div>
								<div className="time text-xs text-gray-400">
									12:24 PM
								</div>
							</div>
							<div className="message-right flex flex-col gap-2 my-2">
								<div className="message rounded-lg px-4 py-2">
									Good, What's up Bro ?
								</div>
								<div className="time text-xs text-gray-400">
									12:24 PM
								</div>
							</div>
							<div className="message-right flex flex-col gap-2 my-2">
								<div className="message rounded-lg px-4 py-2">
									Hangout tonight ?
								</div>
								<div className="time text-xs text-gray-400">
									12:24 PM
								</div>
							</div>
							<div className="message-right flex flex-col gap-2 my-2">
								<div className="message rounded-lg px-4 py-2">
									Hangout tonight ?
								</div>
								<div className="time text-xs text-gray-400">
									12:24 PM
								</div>
							</div>
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

						{/* VOICE INPUT */}
						<div className="flex items-center justify-center p-3 rounded-full bg-[#ccc]">
							<LuMic size={24} />
						</div>
					</div>
				</div>

				{/* USER INFORMATION */}
				<div className="w-[20%] min-h-[60dvh] max-h-[60dvh] 2xl:flex hidden flex-col items-center justify-start p-6 bg-[#F8F9FA] shadow-messagebox">
					{/* HEADER */}
					<div className="flex items-center justify-start self-start">
						<span className="text-[1.05rem]">Contact info</span>
					</div>

					{/* INFO */}
					<div className="flex flex-col items-center justify-center p-5 ">
						{/* AVATAR */}
						<div className="avatar py-3">
							<div className="w-[6rem] rounded-full">
								<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
							</div>
						</div>

						{/* NAME */}
						<div className="font-bold text-xl">Hamed</div>

						{/* STATUS */}
						<span className="text-xs text-gray-400">Online</span>

						{/* ICONS */}
						<div className="flex items-center justify-center gap-3 py-5">
							<div className="p-2 rounded-full bg-[#E8ECEF] hover:bg-[#71B190] cursor-pointer ">
								<LuVideo size={20} />
							</div>
							<div className="p-2 rounded-full bg-[#E8ECEF] hover:bg-[#71B190]  cursor-pointer ">
								<LuPhone size={18} />
							</div>
						</div>
					</div>
					{/* OPTIONS */}
					<div className="flex flex-col items-start justify-start self-start gap-2 w-full">
						<div className="text-sm font-bold">About</div>
						<div className="text-sm text-gray-400 mb-1">
							Hello My name is Hamed...
						</div>
						<div className="text-sm font-bold">
							Media,links and doc
						</div>
						<div className="flex items-start justify-start gap-1 mb-4">
							<img
								className="rounded-lg"
								src="https://picsum.photos/50/50"
								alt=""
							/>
							<img
								className="rounded-lg"
								src="https://picsum.photos/50/50"
								alt=""
							/>
							<img
								className="rounded-lg"
								src="https://picsum.photos/50/50"
								alt=""
							/>
							<img
								className="rounded-lg"
								src="https://picsum.photos/50/50"
								alt=""
							/>
							
						</div>

						<div className="flex items-center justify-between w-full">
							<div className="text-sm font-bold">
								Mute notifications
							</div>
							<input type="checkbox" className="toggle toggle-sm toggle-success" />
						</div>

						<div className="flex items-center justify-between w-full">
							<div className="text-sm font-bold">
								Disappear messages
							</div>
							<input type="checkbox" className="toggle toggle-sm toggle-success" />
						</div>

                        <div className="flex items-center justify-start w-full gap-2 mt-3 cursor-pointer ">
                            <LuTrash color="#D35582" />
							<div className="text-sm text-[#D35582]">
								Delete chat
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
