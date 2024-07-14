import WebSocket, { Server, WebSocketServer } from 'ws';
import { UserManager } from './userManager';

const wss = new WebSocketServer({});

let userList: string[] = []

wss.on('connection', function connection(ws: WebSocket & { userId?: string }) {

  console.log('New connection established');

  const newUser = UserManager.getInstance().addUser(ws)
  newUser.addListeners();
  ws.userId = newUser.id
  userList.push(newUser.id);

  ws.send(JSON.stringify({ type: 'userList', userList , you: newUser.id }));

  broadcastUserList(wss, ws);

  ws.on('close', () => {
    userList = userList.filter(user => user !== ws.userId);
    broadcastUserList(wss, ws);
  });
  

});

function broadcastUserList(wss: Server, currentClient?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client !== currentClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'userList', userList }));
    }
  });
}


