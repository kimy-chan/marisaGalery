const Server = require("./src/app");

function init() {
    const app = new Server(process.env.PORT);
    app.start();

}

init()