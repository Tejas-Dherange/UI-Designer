'use client';

import { useParams } from 'next/navigation';
import Chat from '@/components/Chat';

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="h-screen p-4">
      <div className="max-w-4xl h-[600px] mx-auto">
        <Chat 
          roomId={roomId}
          currentUser={{
            id: "1",  // Replace with actual user ID from your auth system
            username: "TestUser"
          }}
        />
      </div>
    </div>
  );
}