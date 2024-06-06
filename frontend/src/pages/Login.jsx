import React, { useContext, useEffect, useState } from "react";
import { LuAtSign, LuKey } from "react-icons/lu";
import GoogleSVG from "../components/SVG/GoogleSVG";
import { Link, useNavigate } from "react-router-dom";
import configDev from "../configs/config.dev";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

export default function LoginPage() {
	const { user, setUser } = useContext(AuthContext);
	const navigate = useNavigate();
	
	useEffect(() => {
		if(user) {
			navigate("/");
		}
	}, [user]);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = () => {
		const Login = async () => {
			const options = {
				url: configDev.API_URL + "/auth/signIn",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				data: formData,
				withCredentials: true,
			};

			await axios.request(options).then((response) => {
				const result = response.data;

				if (result.success) {
					storeUser(result);
					navigate("/");
				}
			}).catch(err => {
				console.log(err)
			})
		};

		Login();
	};

	const storeUser = (result) => {
		setUser(result.metadata.user);
		localStorage.setItem("user", JSON.stringify(result.metadata.user));
		localStorage.setItem("refreshToken", result.metadata.refreshToken);
		localStorage.setItem("accessToken", result.metadata.accessToken);
	};

	return (
		<div
			className="w-[24rem] min-h-[20rem] flex flex-col items-center justify-center 
       bg-[#F5F6F6] rounded-lg p-4 gap-3 shadow-messagebox"
		>
			<img className="w-48" src="/logo_2.png" alt="test" />
			<label className="input bg-[#E8ECEF] flex items-center gap-4">
				<LuAtSign />
				<input
					type="email"
					className="grow"
					placeholder="Email"
					name="email"
					value={formData["email"]}
					onChange={(e) => {
						handleChangeInput(e);
					}}
				/>
			</label>
			<label className="input bg-[#E8ECEF] input-bordered flex items-center gap-4">
				<LuKey />
				<input
					type="password"
					className="grow"
					placeholder="Password"
					name="password"
					value={formData["password"]}
					onChange={(e) => {
						handleChangeInput(e);
					}}
				/>
			</label>

			<button
				onClick={onSubmit}
				className="w-[40%] h-10 rounded-badge text-center mt-3
        	bg-zinc-600 hover:bg-[#71b190] flex items-center justify-center"
			>
				<span className="text-white text-base">Login</span>
			</button>

			<div className="divider text-xs my-1">OR</div>

			<Link to={"/register"} className="text-xs text-zinc-800 hover:text-[#71b190]">
				Your don't have any account?
			</Link>

			<button
				className="google-login-btn w-[90%] h-10 rounded-badge text-sm mb-3
        		bg-[#3273FF] border-2 border-[#3273FF] flex items-center justify-start gap-16"
			>
				<div className="w-[2.2rem] h-[2.2rem] rounded-full bg-white flex items-center justify-center">
					<GoogleSVG />
				</div>
				<span className="text-white">Sign in with Google</span>
			</button>
		</div>
	);
}
