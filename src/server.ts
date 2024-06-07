import { Server } from "http";
import app from "./app";
import config from "./config";

const PORT = config.PORT || 5000;

let server: Server;

function main() {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
