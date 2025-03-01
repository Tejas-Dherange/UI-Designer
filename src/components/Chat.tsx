'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';

interface Message {
  content: string;
  userId: string;
  username: string;
  timestamp: Date;
}

interface ChatProps {
  roomId: string;
  currentUser: {
    id: string;
    username: string;
  };
}

export default function Chat({ roomId, currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', roomId);

    socket.on('receive-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leave-room', roomId);
      socket.off('receive-message');
    };
  }, [socket, roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      roomId,
      content: newMessage,
      userId: currentUser.id,
      username: currentUser.username,
      timestamp: new Date(),
    };

    socket.emit('send-message', messageData);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.userId === currentUser.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.userId === currentUser.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p className="text-sm font-semibold">{message.username}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}