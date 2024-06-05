const app = require("./src/app");
const PORT = process.env.PORT || 2405;

app.listen(PORT, () => {
	console.log(`🚀 Server ready on port ${PORT}`);
});
