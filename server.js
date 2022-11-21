const app = require("./app");
const http = require("http").Server(app);
require("dotenv").config();

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
    console.log(`Running on port ${PORT}...`);
});
