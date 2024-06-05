import React from "react";
import { formatTimestamp } from "../../../ultils";
import classNames from "classnames";

export default function Conversation({
	conversation,
	active = false,
	...props
}) {
	const formattedCreatedAt = formatTimestamp(
		conversation?.lastMessage?.createdAt
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
			})}
		>
			<div className="w-[20%] flex items-center">
				<div className={`avatar ${conversation?.partner?.status}`}>
					<div className="w-12 rounded-full">
						<img src={conversation?.partner?.avatar} />
					</div>
				</div>
			</div>

			<div className="w-[80%] flex flex-col items-start justify-center">
				<div className="flex items-center justify-between w-full">
					<span className="font-bold">
						{conversation?.partner?.username}
					</span>
					<span className="text-gray-400 text-xs">{formatTime}</span>
				</div>

				<div className="max-w-[90%] truncate">
					<span className="text-gray-400 text-sm">
						{conversation?.lastMessage?.message}
					</span>
				</div>
			</div>
		</div>
	);
}
