"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const userManager_1 = require("./userManager");
class User {
    constructor(id, ws) {
        this.id = id;
        this.ws = ws;
    }
    emit(message) {
        this.ws.send(JSON.stringify(message));
    }
    addListeners() {
        this.ws.on("message", (message) => {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.method === 'PING') {
                if (parsedMessage.to) {
                    const recipient = userManager_1.UserManager.getInstance().getUser(parsedMessage.to);
                    if (recipient) {
                        recipient.emit({ from: this.id, type: 'Ping!' });
                    }
                }
                else {
                    userManager_1.UserManager.getInstance().broadcastPing(this.id);
                }
            }
        });
    }
}
exports.User = User;
