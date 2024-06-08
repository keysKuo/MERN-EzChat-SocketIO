import React from "react";
import { useSocketContext } from "../../../contexts/SocketProvider";

export default function OnlineUsers({ users }) {
	const { onlineUsers } = useSocketContext();

	return (
		<>
			{users.map((user, index) => {
				if (onlineUsers.includes(user?._id)) {
					return (
						<div key={index} className="avatar online">
							<div className="w-10 rounded-full">
								<img
									src={
										user?.avatar ||
										"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
									}
								/>
							</div>
						</div>
					);
				}
			})}
		</>
	);
}
