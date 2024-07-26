'use client';

const MapSelect = ({ next }: { next: () => void }) => {
  return (
    <div>
      <div>
        <button>1일차</button>
        <button>2일차</button>
        <button>3일차</button>
      </div>

      <button onClick={next}>장소 추가하기</button>
    </div>
  );
};
export default MapSelect;
