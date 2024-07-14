"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const user_1 = require("./user");
class UserManager {
    constructor() {
        this.users = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    addUser(ws) {
        const id = this.getRandomId();
        const newUser = new user_1.User(id, ws);
        this.users.set(id, newUser);
        this.registerOnClose(ws, id);
        return newUser;
    }
    registerOnClose(ws, id) {
        ws.on("close", () => {
            this.users.delete(id);
        });
    }
    getUser(id) {
        return this.users.get(id);
    }
    broadcastPing(senderId) {
        this.users.forEach(user => {
            if (user.id !== senderId) {
                user.emit({ from: senderId, type: 'Ping!' });
            }
        });
    }
    getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
exports.UserManager = UserManager;
