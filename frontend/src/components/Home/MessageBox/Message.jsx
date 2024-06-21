import React from "react";
import { formatTimestamp } from "../../../ultils";
import classNames from "classnames";
import Markdown from "../Markdown";
import LineChart from "../../Charts/LineChart";

export default function Message({
	type = "left",
	message,
	chartData,
	createdAt,
	hiddenTime = false,
	shouldShake
}) {
	return (
		<>
			<div
				className={`message-${type} relative items-start gap-2 my-2`}
			>
				<div
					className={classNames({
						"message rounded-lg px-4 py-2 bg-gray-100 w-[100%]": true,
						"self-end": type === "right",
						"shake": shouldShake
					})}
					style={{
						wordWrap: "break-word",
						overflowWrap: "break-word",
						wordBreak: "break-word",
					}}
				>
					{/* {message} */}
					<Markdown content={message} />
					
					{chartData && <>
						<br />
						<LineChart data={chartData} />
					</>}
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
