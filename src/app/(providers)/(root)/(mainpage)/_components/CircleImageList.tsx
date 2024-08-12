import Image from 'next/image';
import { useRouter } from 'next/navigation';

const locations = [
  { name: 'Busan', src: '/img/busan.png' },
  { name: 'Seoul', src: '/img/seoul.png' },
  { name: 'Chuncheon', src: '/img/chuncheon.png' },
  { name: 'Jeju', src: '/img/jeju.png' }
];

export default function CircleImageList() {
  const router = useRouter();

  const handleClick = (locationName: string) => {
    const query = new URLSearchParams();
    query.set('city', locationName);
    router.push(`/results?${query.toString()}`);
  };

  return (
    <div className="mt-[16px] flex justify-around bg-white p-4">
      {locations.map((location) => (
        <div key={location.name} className="flex flex-col items-center" onClick={() => handleClick(location.name)}>
          <Image
            src={location.src}
            alt={location.name}
            width={80}
            height={80}
            className="h-16 w-16 rounded-full border-gray-300"
          />
          <span className="mt-2 text-center text-xs">{location.name}</span>
        </div>
      ))}
    </div>
  );
}
