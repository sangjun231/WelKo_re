import RegionForm from './_components/RegionForm';

export interface CalendarProps {
  next: () => void;
}

function RegionPage() {
  return (
    <div className="mx-[20px]">
      <RegionForm />
    </div>
  );
}
export default RegionPage;
