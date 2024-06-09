import React from "react";
import { formatTimestamp } from "../../../ultils";
import classNames from "classnames";

export default function Message({
	type = "left",
	message,
	createdAt,
	hiddenTime = false,
	shouldShake
}) {
	return (
		<>
			<div
				className={`message-${type} flex flex-col items-start gap-2 my-2 lg:max-w-[40%] max-w-[54%]`}
			>
				<div
					className={classNames({
						"message rounded-lg px-4 py-2 bg-gray-100": true,
						"self-end": type === "right",
						"shake": shouldShake
					})}
					style={{
						wordWrap: "break-word",
						overflowWrap: "break-word",
						wordBreak: "break-word",
					}}
				>
					{message}
				</div>
				<div
					className={classNames({
						"text-xs text-gray-400": true,
						hidden: hiddenTime,
						"self-end": type === "right",
						"ml-2": type === "left"
					})}
				>
					{formatTimestamp(createdAt)}
				</div>
			</div>
		</>
	);
}
