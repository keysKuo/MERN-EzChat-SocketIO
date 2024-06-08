
const dev = {
	API_URL: "http://localhost:2405/api/v1",
	SOCKET_URL: "http://localhost:2405"
}

const production = {
	API_URL: import.meta.env.VITE_API_URL,
	SOCKET_URL: import.meta.env.VITE_SOCKET_URL 
}

const configs = { dev, production };
const env = import.meta.env.VITE_NODE_ENV?.trim() || 'dev';
console.log(configs[env]);
export default configs[env];


