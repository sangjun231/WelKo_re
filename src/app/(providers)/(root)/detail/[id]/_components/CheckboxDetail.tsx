'use client';

import React, { useEffect } from 'react';
import { TbBed, TbTicket, TbBus } from 'react-icons/tb';
import { PiForkKnife } from 'react-icons/pi';
import usePostStore from '@/zustand/postStore';
import { useParams } from 'next/navigation';

export const CheckboxDetail = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { post, fetchPost } = usePostStore((state) => ({
    post: state.post,
    fetchPost: state.fetchPost
  }));

  useEffect(() => {
    fetchPost(postId);
  }, [postId, fetchPost]);

  if (!post) return <div>Loading...</div>;

  const selectedPrices = post.selectedPrices || [];

  const offers = [
    { label: 'Room charge', icon: <TbBed size={24} /> },
    { label: 'Restaurant', icon: <PiForkKnife size={24} /> },
    { label: 'Ticket', icon: <TbTicket size={24} /> },
    { label: 'Transportation', icon: <TbBus size={24} /> }
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">What this tour offers</h2>
      {offers.map(
        (offer) =>
          selectedPrices.includes(offer.label) && (
            <div key={offer.label} className="flex items-center">
              {offer.icon}
              <span className="ml-2 text-sm font-normal">{offer.label}</span>
            </div>
          )
      )}
      <hr className="bg-grayscale-100 my-8 h-[1px] w-full" />
    </div>
  );
};
