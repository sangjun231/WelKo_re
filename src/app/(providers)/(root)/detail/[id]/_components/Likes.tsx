import { FaRegHeart } from 'react-icons/fa';
import { TbPencil, TbTrash } from 'react-icons/tb';

export interface Heart {
  liked: boolean;
}

const Likes = () => {
  return (
    <div>
      <TbPencil />
      <button>
        <TbTrash />
      </button>
      <button>
        <FaRegHeart size={30} />
      </button>
    </div>
  );
};

export default Likes;
