'use client';

import React, { useEffect } from 'react';
import usePostStore from '@/zustand/postStore';
import { useParams } from 'next/navigation';
import IconRoom from '/public/icons/detail_icons/icon_room_charge.svg';
import IconRestaurant from '/public/icons/detail_icons/icon_restaurant.svg';
import IconTicket from '/public/icons/detail_icons/icon_ticket.svg';
import IconTransportation from '/public/icons/detail_icons/icon_transportation.svg';

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
    { label: 'Room charge', icon: <IconRoom alt="Room charge" width={24} height={24} /> },
    { label: 'Restaurant', icon: <IconRestaurant alt="Restaurant" width={24} height={24} /> },
    { label: 'Ticket', icon: <IconTicket alt="Ticket" width={24} height={24} /> },
    { label: 'Transportation', icon: <IconTransportation alt="Transportation" width={24} height={24} /> }
  ];

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-lg font-semibold">What this tour offers</h2>
      <div className="flex flex-col gap-4">
        {offers.map(
          (offer) =>
            selectedPrices.includes(offer.label) && (
              <div key={offer.label} className="flex items-center">
                {offer.icon}
                <span className="ml-2 text-sm font-normal">{offer.label}</span>
              </div>
            )
        )}
        <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
      </div>
    </div>
  );
};
