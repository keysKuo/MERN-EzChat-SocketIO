import React from "react";
import { formatTimestamp } from "../../../ultils";

export default function Message({
	type = "left",
	message,
	createdAt,
	hiddenTime = false,
}) {
	return (
		<>
			<div className={`message-${type} flex flex-col gap-2 my-2`}>
				<div className="message rounded-lg px-4 py-2">{message}</div>
				<div
					className={`${
						hiddenTime && "hidden"
					} time text-xs text-gray-400`}
				>
					{formatTimestamp(createdAt)}
				</div>
			</div>
		</>
	);
}
