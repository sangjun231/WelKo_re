import { FaRegHeart } from 'react-icons/fa';

export interface Heart {
  liked: boolean;
}

const Likes = () => {
  return (
    <div>
      <button>
        <FaRegHeart size={30} />
      </button>
    </div>
  );
};

export default Likes;
