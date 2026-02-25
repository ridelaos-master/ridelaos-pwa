import { useParams } from 'react-router-dom';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-full bg-rl-bg p-4">
      <h1 className="text-2xl font-semibold text-rl-green">예약</h1>
      <p className="text-rl-green-mid mt-2">예약 ID: {id}</p>
    </div>
  );
}
