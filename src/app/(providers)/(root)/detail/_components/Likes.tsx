import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

export interface Heart {
  liked: boolean;
}

const Likes = () => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div>
      <button onClick={handleLike}>{liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}</button>
    </div>
  );
};

export default Likes;
