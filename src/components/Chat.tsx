import { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type ChatProps = {
  senderId: string;
  receiverId: string;
};

const Chat: React.FC<ChatProps> = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchedMessages = await fetchMessages(senderId, receiverId);
      setMessages(fetchedMessages);
    }, 3000);

    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendMessage(senderId, receiverId, newMessage);
      setNewMessage('');
      const fetchedMessages = await fetchMessages(senderId, receiverId);
      setMessages(fetchedMessages);
    }
  };

  return (
    <div className="flex h-screen flex-col border border-gray-300">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 rounded p-2 ${
              msg.sender_id === senderId ? 'self-end bg-green-200' : 'self-start bg-white'
            }`}
          >
            {msg.content}
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
