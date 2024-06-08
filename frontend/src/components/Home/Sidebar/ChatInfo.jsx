import React from "react";
import { formatTimestamp } from "../../../ultils";
import classNames from "classnames";
import { useSocketContext } from "../../../contexts/SocketProvider";

export default function Conversation({
	conversation,
	active = false,
	shouldShake,
	...props
}) {
	const { onlineUsers } = useSocketContext();
	const userStatus = onlineUsers.includes(conversation?.partner?._id) ? 'online' : 'offline'
	
	const formattedCreatedAt = formatTimestamp(
		conversation?.messages[conversation.messages.length - 1]?.createdAt
	).split("-");
	const formatTime =
		formattedCreatedAt.length > 1
			? formattedCreatedAt[1].trim()
			: formattedCreatedAt[0].trim();

	return (
		<div
			{...props}
			className={classNames({
				"chat-item flex items-center justify-between gap-3 w-full px-4 py-2 cursor-pointer": true,
				"bg-[#E8ECEF]": active,
				"shake": shouldShake
			})}
		>
			<div className="flex items-center">
				<div className={`avatar ${userStatus}`}>
					<div className="w-12 rounded-full">
						<img src={conversation?.partner?.avatar} />
					</div>
				</div>
			</div>

			<div className="lg:w-[80%] w-[70%] flex flex-1 flex-col items-start justify-center">
				<div className="flex items-center justify-between w-full">
					<span className="font-bold">
						{conversation?.partner?.username}
					</span>
					<span className="text-gray-400 text-xs lg:flex hidden">{formatTime}</span>
				</div>

				<div className="max-w-[90%] truncate">
					<span className="text-gray-400 text-sm">
						{conversation?.messages[conversation.messages.length - 1]?.message}
					</span>
				</div>
			</div>
		</div>
	);
}
