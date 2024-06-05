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

const logo_url = "/logo.png";

export default function Header() {
	const { user, setUser } = useContext(AuthContext);
	const navigate = useNavigate();
    
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

							<span className="flex flex-row px-4 rounded-badge gap-1 text-sm text-center items-center leading-10 font-bold bg-[#ccc] hover:bg-[#71B190]">
								{user.username}  <LuChevronDown size={16} />
							</span>

                           
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
