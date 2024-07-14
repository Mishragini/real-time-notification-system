import { WebSocket } from "ws";
import { User } from "./user";

export class UserManager {
    private static instance : UserManager;
    private users: Map<string, User> = new Map();

    private constructor() {
        
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    public addUser(ws: WebSocket) {
        const id = this.getRandomId();
        const newUser = new User(id, ws);
        this.users.set(id, newUser);
        this.registerOnClose(ws, id);
        return newUser;
    }

    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);
        });
    }

    public getUser(id: string) {
        return this.users.get(id);
    }


    public broadcastPing(senderId: string) {
        this.users.forEach(user => {
            if (user.id !== senderId) {
                user.emit({ from: senderId, type: 'Ping!' });
            }
        });
    }

    

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}