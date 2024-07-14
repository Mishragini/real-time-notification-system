export type subscribeMessage = {
    method : "SUBSCRIBE",
    params : string[]
}

export type unsubscribeMessage = {
    method : "UNSUBSCRIBE",
    params : string[]
}

export type pingMessage = {
    method: "PING",
    to?: string 
}

export type IncomingMessage = subscribeMessage | unsubscribeMessage | pingMessage;