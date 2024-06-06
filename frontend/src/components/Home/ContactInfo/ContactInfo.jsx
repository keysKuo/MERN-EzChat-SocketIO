import React from "react";
import { LuPhone, LuTrash, LuVideo } from "react-icons/lu";

export default function ContactInfo({ conversation }) {
	return (
		<>
			{/* HEADER */}
			<div className="flex items-center justify-start self-start">
				<span className="text-[1.05rem]">Contact info</span>
			</div>

			{/* INFO */}
			<div className="flex flex-col items-center justify-center p-5 ">
				{/* AVATAR */}
				<div className="avatar py-3">
					<div className="w-[6rem] rounded-full">
						<img
							src={
								conversation?.partner?.avatar ||
								"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
							}
						/>
					</div>
				</div>

				{/* NAME */}
				<div className="font-bold text-xl">{conversation?.partner?.username}</div>

				{/* STATUS */}
				<span className="text-xs text-gray-400">{conversation?.partner?.status}</span>

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
					Hello My name is {conversation?.partner?.username}...
				</div>
				<div className="text-sm font-bold">Media,links and doc</div>
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
					<div className="text-sm font-bold">Mute notifications</div>
					<input
						type="checkbox"
						className="toggle toggle-sm toggle-success"
						defaultChecked
					/>
				</div>

				<div className="flex items-center justify-between w-full">
					<div className="text-sm font-bold">Disappear messages</div>
					<input
						type="checkbox"
						className="toggle toggle-sm toggle-success"
					/>
				</div>

				<div className="flex items-center justify-start w-full gap-2 mt-3 cursor-pointer ">
					<LuTrash color="#D35582" />
					<div className="text-sm text-[#D35582]">Delete chat</div>
				</div>
			</div>
		</>
	);
}
