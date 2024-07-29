import { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  post_id: string;
};

type ChatProps = {
  senderId: string;
  receiverId: string;
  postId: string;
};

const Chat: React.FC<ChatProps> = ({ senderId, receiverId, postId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedMessages = await fetchMessages(senderId, receiverId);
      setMessages(fetchedMessages);
    }, 1000);

    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendMessage(senderId, receiverId, newMessage, postId);
      setNewMessage('');
      const fetchedMessages = await fetchMessages(senderId, receiverId);
      setMessages(fetchedMessages);
    }
  };

  return (
    <div className="flex h-screen max-w-[360px] flex-col border border-gray-300 text-[14px]">
      <div className="overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-10 flex flex-col ${msg.sender_id === senderId ? 'items-end' : 'items-start'}`}
          >
            {msg.sender_id !== senderId && <p className="mr-2 text-sm font-bold">{msg.sender_id}</p>}
            <div
              className={`max-w-[240px] break-all rounded p-2 ${msg.sender_id === senderId ? 'bg-green-200' : 'bg-gray-200'}`}
            >
              <p>{msg.content}</p>
            </div>
            <p className={` ${msg.sender_id === senderId ? 'right-0' : 'left-0'} mt-2 text-[10px] text-gray-500`}>
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-300 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded border border-gray-300 p-2"
        />
        <button onClick={handleSend} className="ml-2 rounded bg-blue-500 p-2 text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
