const dev = {
    port: 2405,
    mongodbURL: 'mongodb://127.0.0.1:27017/ChatApp',
    frontendURL: 'http://localhost:5173',
    backendURL: 'http://localhost:2405'
}

const production = {
    port: 2405,
    mongodbURL: process.env.MONGODB_URL,
    frontendURL: process.env.FRONTEND_URL,
    backendURL: process.env.BACKEND_URL
}

const configs = { dev, production }
const env = process.env.NODE_ENV?.trim() || 'dev';
module.exports = configs[env];