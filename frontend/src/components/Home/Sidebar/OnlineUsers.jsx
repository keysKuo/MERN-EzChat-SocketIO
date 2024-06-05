import React from "react";

export default function OnlineUsers({ users }) {
	return (
		<>
			{users.map((user, index) => {
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
			})}
		</>
	);
}
