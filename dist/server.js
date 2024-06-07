"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const PORT = config_1.default.PORT || 5000;
let server;
function main() {
    server = app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
main();
