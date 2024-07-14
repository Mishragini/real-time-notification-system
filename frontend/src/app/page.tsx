"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const WebSocketComponent: React.FC = () => {
  const session = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<string[]>([]);
  const [you, setYou] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'userList') {
        setUsers(message.userList);
        if (message.you) setYou(message.you);
      }
      if (message.type === 'Ping!') {
        console.log("ping received!")
        toast({title:`You got pinged by ${message.from}`});
      }
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    setWs(ws);
    return () => ws.close();
  }, [toast]);

  const sendPing = (to?: string) => {
    if (!ws) {
      console.log("No WebSocket connection :(");
      return;
    }
    ws.send(JSON.stringify({ method: "PING", to }));
  };

  if(!session.data) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <div>Not signed in!</div>
        <Button variant="secondary" onClick={() => signIn()}>Sign in</Button>
      </div>
    )
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Connected Users</h1>
      <p className="text-xl mb-6">You: <span className="font-semibold">{you}</span></p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {users.filter(user => user !== you).map((user, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">User ID: <br/> {user}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => {
                  sendPing(user)
                  toast({
                    title: `You Pinged user ${user}`,
                    
                  })
          
                }}
              >
                Ping
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          sendPing()
          toast({
            title:"You pinged all the users"
          })
        }}
      >
        Ping All
      </Button>
    </div>
  );
};

export default WebSocketComponent;