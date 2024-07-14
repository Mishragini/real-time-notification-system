import { WebSocket } from "ws";
import { IncomingMessage, pingMessage } from "./types";
import { UserManager } from "./userManager";

export class User {
    public id : string;
    private ws: WebSocket;

    constructor(id: string, ws: WebSocket){
        this.id = id;
        this.ws = ws;
    }

    emit(message : any) {
        this.ws.send(JSON.stringify(message))
    }

    public addListeners() {
        this.ws.on("message", (message: string) => {
            const parsedMessage: IncomingMessage = JSON.parse(message);

            if (parsedMessage.method === 'PING') {
                if (parsedMessage.to) {
                    const recipient = UserManager.getInstance().getUser(parsedMessage.to);
                    if (recipient) {
                        recipient.emit({ from: this.id, type: 'Ping!' });
                    }
                } else {
                    UserManager.getInstance().broadcastPing(this.id);
                }
            }
        });
    }

}