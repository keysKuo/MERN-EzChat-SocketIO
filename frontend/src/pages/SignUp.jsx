import React, { useContext, useEffect, useState } from "react";
import { LuAtSign, LuFileKey, LuKey, LuUser } from "react-icons/lu";
import GoogleSVG from "../components/SVG/GoogleSVG";
import { Link, useNavigate } from "react-router-dom";
import configDev from "../configs/config.dev";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

export default function SignUpPage() {
	const { user, setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		gender: "male",
	});

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = () => {
		const SignUp = async () => {
			const options = {
				url: configDev.API_URL + "/auth/signUp",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				data: formData,
				withCredentials: true,
			};

			await axios
				.request(options)
				.then((response) => response.data)
				.then((result) => {
					if (result.success) {
						navigate("/login");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};

		SignUp();
	};

	return (
		<div
			className="w-[24rem] min-h-[20rem] flex flex-col items-center justify-center 
       bg-[#F5F6F6] rounded-lg p-4 gap-3 shadow-messagebox"
		>
			<img className="w-48" src="/logo_2.png" alt="test" />

			<label className="input bg-[#E8ECEF] flex items-center gap-4">
				<LuUser />
				<input
					type="text"
					className="grow"
					placeholder="Username"
					name="username"
					value={formData["username"]}
					onChange={(e) => {
						handleChangeInput(e);
					}}
				/>
			</label>

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

			<label className="input bg-[#E8ECEF] input-bordered flex items-center gap-4">
				<LuFileKey />
				<input
					type="password"
					className="grow"
					placeholder="Re-enter Password"
					name="confirmPassword"
					value={formData["confirmPassword"]}
					onChange={(e) => {
						handleChangeInput(e);
					}}
				/>
			</label>

			<div className="flex items-center justify-between gap-5 mt-3">
				<label className="flex items-center gap-2">
					<span className="label-text">Male</span>
					<input
						onChange={(e) => {
							handleChangeInput(e);
						}}
						type="radio"
						name="gender"
            value="male"
						className="radio radio-primary checked:bg-[#6ECCD4] radio-xs"
						defaultChecked
					/>
				</label>
				<label className="flex items-center gap-2">
					<span className="label-text">Female</span>
					<input
						onChange={(e) => {
							handleChangeInput(e);
						}}
						type="radio"
						name="gender"
            value="female"
						className="radio radio-primary checked:bg-[#FEA2AD] radio-xs"
					/>
				</label>
			</div>

			<button
				onClick={onSubmit}
				className="w-[40%] h-10 rounded-badge text-center mt-3
        	bg-zinc-600 hover:bg-[#71b190] flex items-center justify-center"
			>
				<span className="text-white text-base">Register</span>
			</button>

			<div className="divider text-xs my-1">OR</div>

			<Link
				to={"/login"}
				className="text-xs text-zinc-800 hover:text-[#71b190]"
			>
				You've already had an account?
			</Link>
		</div>
	);
}
