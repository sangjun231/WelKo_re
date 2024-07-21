import { FaRegHeart } from 'react-icons/fa';

export interface Heart {
  liked: boolean;
}

const Likes = () => {
  return <div><FaRegHeart /></div>;
};

export default Likes;
