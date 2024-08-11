import { useEffect, useState } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';
import Image from 'next/image';
import { format } from 'date-fns';

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
  is_checked: boolean;
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

  const groupedMessages = messages.reduce(
    (groups, msg) => {
      const date = format(new Date(msg.created_at), 'MMMM dd, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
      return groups;
    },
    {} as Record<string, Message[]>
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await fetchMessages(senderId, receiverId, postId);
      setMessages(fetchedMessages);
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [senderId, receiverId, postId]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-grow overflow-y-auto pb-[180px]">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <p className="mt-[8px] text-center text-[10px] text-grayscale-500">{date}</p>
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`mb-[16px] mt-[24px] flex flex-col ${msg.sender_id === senderId ? 'items-end' : 'items-start'}`}
              >
                {msg.sender_id !== senderId && msg.sender && (
                  <div className="flex items-center">
                    <Image
                      className="rounded-full"
                      src={msg.sender.avatar}
                      alt="avatar"
                      width={44}
                      height={44}
                      style={{ width: '44px', height: '44px' }}
                    />
                    <p className="ml-[8px] text-[13px] font-semibold">{msg.sender.name}</p>
                  </div>
                )}
                <div className="flex items-end">
                  <p
                    className={`${
                      msg.sender_id === senderId ? 'mr-[8px]' : 'order-1 ml-[8px]'
                    } mt-[4px] text-[10px] text-grayscale-500`}
                  >
                    {format(new Date(msg.created_at), 'HH:mm')}
                  </p>
                  <div
                    className={`max-w-[240px] break-all px-[8px] py-[12px] ${
                      msg.sender_id === senderId
                        ? 'rounded-br-0 rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-primary-50'
                        : 'rounded-bl-0 ml-[56px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] bg-grayscale-50'
                    }`}
                  >
                    <p className="text-[14px]">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 flex items-center border-t bg-white pb-[16px] pt-[16px]">
        <input
          className="h-[48px] flex-1 rounded-[16px] border bg-grayscale-50 p-[16px] text-[16px]"
          type="text"
          placeholder="Placeholder text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-[12px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary-300"
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
