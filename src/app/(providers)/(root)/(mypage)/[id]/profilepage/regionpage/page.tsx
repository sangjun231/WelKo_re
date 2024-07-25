import RegionForm from './_components/RegionForm';

export interface CalendarProps {
  next: () => void;
}

function RegionPage() {
  return (
    <div>
      <RegionForm />
    </div>
  );
}
export default RegionPage;
