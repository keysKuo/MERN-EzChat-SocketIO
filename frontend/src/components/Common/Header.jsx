import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	LuChevronDown,
	LuFolderOpen,
	LuHelpCircle,
	LuLogOut,
	LuSearch,
	LuTicket,
	LuUser,
} from "react-icons/lu";
import { AuthContext } from "../../contexts/AuthProvider";
import configDev from "../../configs/config.dev";
import axios from "axios";

const logo_url = "/logo.png";

export default function Header() {
	const { user, setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const onLogout = () => {
		const Logout = async (req, res, next) => {
			const options = {
				url: configDev.API_URL + "/auth/logOut",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-client-id": user._id,
				},
				withCredentials: true,
			};

			await axios
				.request(options)
				.then((response) => response.data)
				.then((result) => {
					if (result.success) {
						setUser(null);
						localStorage.clear();
						navigate("/login");
					}
				})
				.catch((err) => {
					console.log(err);
				});
			// console.log(options);
		};

		Logout();
	};

	return (
		<header
			className="w-full h-[4.5rem] bg-main px-8
            flex items-center 
            fixed top-0 z-10
            border-b-1 border-slate-500 shadow-messagebox"
		>
			<div className="flex items-center h-[100%] ml-10">
				<Link
					to="/"
					className="flex items-center justify-center w-[30%]"
				>
					<img src={logo_url} className="w-[50%]" />
				</Link>
			</div>
			<div className="flex items-center justify-center h-[100%] mr-10 ml-auto">
				<div className="flex items-center text-zinc-800 text-sm">
					{user ? (
						<div className="flex items-center justify-between px-4 cursor-pointer gap-3">
							<div className="avatar">
								<div className="w-12 rounded-full">
									<img src={user.avatar} />
								</div>
							</div>

							<div className="dropdown dropdown-hover">
								<div
									tabIndex={0}
									role="button"
									className="flex flex-row px-4 rounded-badge gap-1 text-sm text-center items-center leading-10 font-bold bg-[#ccc] hover:bg-[#71B190]"
								>
									{user.username} <LuChevronDown size={16} />
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content z-[1] menu shadow-messagebox p-2 w-32"
								>
									<li onClick={onLogout}>
										<a>Logout</a>
									</li>
								</ul>
							</div>
						</div>
					) : (
						<Link to="/login" className="px-4 font-bold">
							Sign In | Sign Up
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
