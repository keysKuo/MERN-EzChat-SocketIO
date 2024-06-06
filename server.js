const app = require("./src/app");
const configs = require('./src/configs');

app.listen(configs['port'], () => {
	console.log(`🚀 Server ready on port ${configs['port']}`);
});
