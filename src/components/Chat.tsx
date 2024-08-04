import { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';
import Image from 'next/image';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  post_id: string;
  sender: User;
  receiver: User;
};

type ChatProps = {
  senderId: string;
  receiverId: string;
  postId: string;
};

const Chat: React.FC<ChatProps> = ({ senderId, receiverId, postId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendMessage(senderId, receiverId, newMessage, postId);
      setNewMessage('');
      const fetchedMessages = await fetchMessages(senderId, receiverId, postId);
      setMessages(fetchedMessages);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await fetchMessages(senderId, receiverId, postId);
      setMessages(fetchedMessages);
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [senderId, receiverId, postId]);

  return (
    <div className="flex h-screen flex-col text-[14px]">
      <div className="overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-10 flex flex-col ${msg.sender_id === senderId ? 'items-end' : 'items-start'}`}
          >
            {msg.sender_id !== senderId && msg.sender && (
              <div className="flex items-center">
                <Image
                  className="mr-2 rounded-full"
                  src={msg.sender.avatar}
                  alt="avatar"
                  width={44}
                  height={44}
                  style={{ width: '44px', height: '44px' }}
                />
                <p className="text-[13px] font-semibold">{msg.sender.name}</p>
              </div>
            )}
            <div
              className={`mt-[7px] max-w-[240px] break-all px-[8px] py-[12px] ${
                msg.sender_id === senderId
                  ? 'bg-primary-50 rounded-br-0 rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px]'
                  : 'rounded-bl-0 rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-grayscale-50'
              }`}
            >
              <p className="text-[14px]">{msg.content}</p>
            </div>
            <p
              className={` ${msg.sender_id === senderId ? 'right-0' : 'left-0'} mt-[4px] text-[10px] text-grayscale-500`}
            >
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="container mx-auto flex items-center justify-between p-8">
        <input
          className="flex-1 rounded-[12px] border bg-grayscale-50 p-2 text-[16px]"
          type="text"
          placeholder="Placeholder text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="mx-auto ml-[8px] flex h-[48px] w-[48px] items-center justify-center rounded-[24px] bg-primary-300"
          onClick={handleSend}
        >
          <Image
            src="/icons/tabler-icon-send.svg"
            alt="Send"
            width={24}
            height={24}
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </div>
    </div>
  );
};

export default Chat;
